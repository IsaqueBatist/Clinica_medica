# 🏗️ Documentação de Decisões Arquiteturais (ADRs)

Este documento detalha as decisões arquiteturais chave da aplicação Clínica Médica.

---

## ADR-001: Arquitetura em Três Camadas

**Status:** Aceito ✅

### Contexto

A aplicação precisava de uma arquitetura escalável que separasse responsabilidades e facilitasse testes e manutenção.

### Decisão

Implementar arquitetura em **três camadas**:

1. **Presentation Layer:** Componentes, telas, hooks e navegação
2. **Business Layer:** Services, contexts e state machines
3. **Data Layer:** Types, models, constants e mocks

### Justificativa

- Facilita testes unitários (cada camada testável independentemente)
- Separa responsabilidades de forma clara
- Permite mudanças em uma camada sem afetar as outras
- Padrão bem estabelecido em arquitetura de software

### Consequências

- Arquivos divididos em múltiplos diretórios
- Necessário seguir regra de imports rigorosamente
- Maior curva de aprendizado para novos desenvolvedores

---

## ADR-002: Context API para State Management

**Status:** Aceito ✅

### Contexto

Aplicação React Native precisa gerenciar estado compartilhado entre múltiplas telas (cliente, consulta, médico, especialidade).

### Decisão

Usar **React Context API** com Contexts segregados por domínio:

- `ContextoCliente`
- `ContextoConsulta`
- `ContextoMedico`
- `ContextoEspecialidade`
- `ContextoTema`
- `ContextoToast`

### Justificativa

- Built-in no React (sem dependências externas)
- Adequado para aplicação pequena/média
- Fácil entender flow de dados
- Context por domínio evita gigantic state objects

### Alternativas Consideradas

- Redux: Overhead para tamanho da app
- Zustand: Adiciona dependência externa
- Prop drilling: Sem separação de responsabilidades

### Consequências

- Re-renders podem ser otimizados com useMemo
- Necessário usar hooks customizados para acessar contexts
- Contexts aninhados precisam ordem correta no `ProvedoresApp`

---

## ADR-003: Services como Camada de Negócio

**Status:** Aceito ✅

### Contexto

Lógica de negócio precisava estar centralizada e testável, separada de componentes.

### Decisão

Implementar **Services** como funções/objetos que implementam interfaces:

```typescript
export interface ServicoCliente {
  listar(...): Promise<PaginatedResult<Cliente>>;
  pegarPorIdentificao(...): Promise<Cliente>;
  cadastrar(...): Promise<Cliente>;
  editar(...): Promise<Cliente>;
  desativar(...): Promise<void>;
}

export const servicoCliente: ServicoCliente = { /* implementação */ };
```

### Justificativa

- Lógica centralizada e reutilizável
- Interfaces permitem múltiplas implementações
- Fácil mockar em testes
- Segue princípio DIP (Dependency Inversion)

### Consequências

- Necessário manter interfaces atualizadas
- Services retornam Promises (async)
- Mocks precisam seguir interfaces

---

## ADR-004: State Machine para Transições de Consulta

**Status:** Aceito ✅

### Contexto

Consultoria pode estar em múltiplos estados (marcada, confirmada, realizada, cancelada) com transições complexas e regras estritas.

### Decisão

Implementar **State Machine** centralizado em função pura (`consultaStateMachine.ts`):

```typescript
const transicoes: Record<SituacaoConsulta, SituacaoConsulta[]> = {
  MARCADA: [CONFIRMADA, CANCELADA_PELO_CLIENTE, ...],
  CONFIRMADA: [REALIZADA, CANCELADA_PELO_CLIENTE, ...],
  // ...
};

export const canTransition = (de, para) => transicoes[de].includes(para);
export const assertTransition = (de, para) => { /* valida */ };
```

### Justificativa

- Transições inválidas se tornam **impossíveis**, não apenas desaconselhadas
- Função pura = testável
- Centralizado = fácil modificar regras
- Documentação clara do fluxo de estados

### Consequências

- Toda mudança de estado deve usar `assertTransition`
- Novo status requer atualizar `transicoes`
- Erros de transição lançam exceções (necessário tratar)

---

## ADR-005: Composição em vez de Herança em Componentes

**Status:** Aceito ✅

### Contexto

Componentes UI precisavam de múltiplas variantes (botões primários, secundários, ghost, etc).

### Decisão

Usar **composição** com propriedade `variant`:

```typescript
<Botao variant="primary">Salvar</Botao>
<Botao variant="secondary">Cancelar</Botao>
<Botao variant="ghost">Ignorar</Botao>
```

Em vez de herança:

```typescript
// ❌ Evitar
class BotaoPrimario extends Botao {
  /* ... */
}
class BotaoSecundario extends Botao {
  /* ... */
}
```

### Justificativa

- Composição mais flexível que herança
- Evita hierarquias profundas
- Mais fácil reutilizar em contextos diferentes
- Segue React best practices

### Consequências

- Lógica de estilos fica dentro de cada componente
- Necessário documentar as variantes disponíveis

---

## ADR-006: TypeScript Strict Mode

**Status:** Aceito ✅

### Contexto

Aplicação precisa de type safety para reduzir bugs e melhorar manutenibilidade.

### Decisão

Habilitar `"strict": true` em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Justificativa

- Detecta `null`/`undefined` em compile-time
- Funções com tipos seguros
- Melhor autocompletion e refactoring
- Documentação viva via tipos

### Consequências

- Código um pouco mais verboso
- Type annotations obrigatórias em alguns casos
- Curva de aprendizado para TypeScript iniciantes

---

## ADR-007: Command Query Separation no Service Layer

**Status:** Aceito ✅

### Contexto

Services tinham mistura de operações de leitura e escrita, dificultando previsibilidade do código.

### Decisão

Separar methods em **Queries** (leitura, sem side-effects) e **Commands** (escrita, com side-effects):

```typescript
// Query - não modifica estado
listar(filtros?: FiltrosCliente): Promise<PaginatedResult<Cliente>>;

// Command - modifica estado
cadastrar(data: CadastrarClienteDTO): Promise<Cliente>;
```

### Justificativa

- Código mais previsível
- Fácil identificar side-effects
- Facilita testes e debugging
- Padrão bem estabelecido (CQRS)

### Consequências

- Necessário manter separação
- Alguns commands retornam dados para confirmação

---

## ADR-008: Contexts Segregados por Domínio

**Status:** Aceito ✅

### Contexto

Evitar Context monolítico que dispara re-renders globais em qualquer mudança de estado.

### Decisão

Criar **múltiplos contexts**, cada um responsável por um domínio:

- `ContextoCliente` — estado de clientes
- `ContextoConsulta` — estado de consultas
- `ContextoMedico` — estado de médicos
- etc.

### Justificativa

- Re-renders apenas em mudanças relevantes
- Responsabilidades bem definidas
- Fácil testar cada contexto isoladamente
- Segue SRP

### Consequências

- Mais contexts = mais providers aninhados
- Necessário exportar hooks customizados
- Order dos providers em `ProvedoresApp` importa

---

## ADR-009: Pasta `features/` para Componentes de Domínio

**Status:** Aceito ✅

### Contexto

Componentes de domínio específico (ex: calendário de consultas) precisavam de lugar bem definido entre `components/` genéricos e `screens/` específicas.

### Decisão

Criar pasta `features/` com subpastas por domínio:

```
features/
├── consultas/      — Componentes específicos de consultas
├── medicos/        — Componentes específicos de médicos
└── clientes/       — Componentes específicos de clientes
```

### Justificativa

- Componentes reutilizáveis em domínio, mas não genéricos
- Melhor organização que espalhá-los em `components/`
- Fácil navegar codebase
- Escalável para novos domínios

### Consequências

- Novo padrão a ser aprendido
- Necessário decidir se componente vai em `features/` ou `components/`

---

## ADR-010: Mocks em vez de Backend Real

**Status:** Aceito ✅
**Escopo:** Temporário até integração com API real

### Contexto

Backend ainda não estava disponível; necessário desenvolver frontend com dados realistas.

### Decisão

Criar **mocks** em `src/mocks/`:

```typescript
// mocks/clientes.ts
export const clientesMock: Cliente[] = [
  { identificacao: 'CLI001', nome: 'João Silva', ... },
  // ...
];
```

Services consomem mocks e simulam delay:

```typescript
export const servicoCliente: ServicoCliente = {
  async listar() {
    await delay();  // Simula latência
    return filtrarMocks(...);
  }
};
```

### Justificativa

- Desenvolvimento paralelo com backend
- Dados realistas para testes
- Sem necessidade de server rodando
- Delay simulado treina reflexo para loading states

### Consequências

- **Técnico:** Mocks estão hardcoded
- **Remediação:** Quando houver API real, trocar implementação dos services mantendo interfaces
- **Nota:** Interfaces de services facilitarão essa transição

---

## Roadmap Arquitetural

### Curto Prazo

- [ ] Adicionar testes unitários para services
- [ ] Testar state machine com mais casos de transição
- [ ] Documentar APIs dos contexts

### Médio Prazo

- [ ] Integração com API backend real
- [ ] Adicionar persistência local (AsyncStorage)
- [ ] Implementar autenticação real

### Longo Prazo

- [ ] Considerar migração para Redux se complexidade crescer
- [ ] Adicionar analytics
- [ ] Otimizar performance com code splitting

---

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Context API Docs](https://react.dev/reference/react/useContext)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [State Machines - Intro](https://statecharts.dev/)

---

**Última atualização:** Maio de 2026
