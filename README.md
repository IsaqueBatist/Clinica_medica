# 📱 Clínica Médica

![Expo](https://img.shields.io/badge/Expo-v54.0.33-000.svg?style=flat-square)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6.svg?style=flat-square)

Aplicação mobile para agendamento de consultas médicas, desenvolvida com **React Native**, **Expo**, **TypeScript** e **React Navigation**. O projeto demonstra boas práticas arquiteturais incluindo SOLID, separação de camadas, state machine para transições de estado e composição de componentes.

---

## 📸 Screenshots

### Fluxo de Autenticação e Cadastro

<div align="center">
  <img src="./assets/screenshots/01-login.png" width="30%" alt="Login"/>
  <img src="./assets/screenshots/02-cadastro.png" width="30%" alt="Cadastro"/>
  <img src="./assets/screenshots/03-selecao-cliente.png" width="30%" alt="Seleção de Cliente"/>
</div>

### Fluxo de Marcação de Consulta (5 Etapas)

<div align="center">
  <img src="./assets/screenshots/04-step1-cliente.jpg" width="30%" alt="Step 1: Cliente"/>
  <img src="./assets/screenshots/05-step3-medico.jpg" width="30%" alt="Step 2: Medico"/>
  <img src="./assets/screenshots/06-step4-agenda.jpg" width="30%" alt="Step 3: Agenda"/>
  <img src="./assets/screenshots/07-step5-resumo.jpg" width="30%" alt="Step 5: Resumo"/>
</div>

### Fluxo de Confirmação, Realização e Encerramento

<div align="center">
  <img src="./assets/screenshots/08-confirmacao.jpg" width="30%" alt="Confirmação"/>
  <img src="./assets/screenshots/09-realizacao.png" width="30%" alt="Realização"/>
  <img src="./assets/screenshots/10-encerramento.png" width="30%" alt="Encerramento"/>
</div>

### Cancelamento de Consulta

<div align="center">
  <img src="./assets/screenshots/11-cancelamento.jpg" width="30%" alt="Cancelamento"/>
</div>

---

## 🛠 Stack Tecnológica

| Tecnologia                       | Versão   | Propósito                          |
| -------------------------------- | -------- | ---------------------------------- |
| **React Native**                 | 0.81.5   | Framework multiplataforma          |
| **Expo**                         | ~54.0.33 | Plataforma de desenvolvimento RN   |
| **TypeScript**                   | ~5.9.2   | Type safety e developer experience |
| **React Navigation**             | 7.x      | Navegação em Drawer e Stack        |
| **React Native Reanimated**      | ~4.1.1   | Animações performáticas            |
| **React Native Gesture Handler** | ~2.28.0  | Suporte a gestos                   |

---

## 📋 Pré-requisitos

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente): `npm install -g expo-cli`
- **Android Studio** ou **Xcode** (para executar no emulador)

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/IsaqueBatist/Clinica_medica.git
cd clinica
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3. Verificar instalação

```bash
npm run --version
npx expo --version
```

---

## ▶️ Como Rodar

### Web (mais rápido para desenvolvimento)

```bash
npm run web
```

### Android

```bash
npm run android
# Certifique-se de que o Android Emulator está rodando
```

### iOS (apenas em macOS)

```bash
npm run ios
```

### Iniciar sem especificar plataforma

```bash
npm start
```

Será aberto um menu interativo para escolher a plataforma.

---

## 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis (camada de apresentação)
│   ├── ui/             # Componentes base (Botao, EntradaTexto, Card, etc)
│   ├── feedback/       # Componentes de feedback (Toast, EmptyState, etc)
│   ├── navegacao/      # Componentes de navegação (BarraInferior, Sidebar)
│   └── index.ts        # Barrel exports
├── screens/            # Telas da aplicação (camada de apresentação)
│   ├── Login/          # Autenticação
│   ├── Cliente/        # Listagem de clientes
│   ├── consulta/       # Marcação, confirmação, cancelamento
│   └── Placeholder/    # Telas genéricas
├── features/           # Domínios específicos com componentes especializados
│   ├── consultas/      # Componentes de consulta (CalendarioDia, BadgeConsulta)
│   ├── medicos/        # Componentes de médico
│   └── clientes/       # Componentes de cliente
├── services/           # Camada de negócio - dados e lógica
│   ├── ClienteService.service.ts
│   ├── ConsultaService.service.ts
│   ├── MedicoService.service.ts
│   ├── EspecialidadeService.service.ts
│   └── DiasAtendimentoService.service.ts
├── contexts/           # State management (React Context por domínio)
│   ├── ContextoCliente.tsx
│   ├── ContextoConsulta.tsx
│   ├── ContextoMedico.tsx
│   ├── ContextoEspecialidade.tsx
│   ├── ContextoTema.tsx
│   ├── ContextoToast.tsx
│   └── ProvedoresApp.tsx
├── hooks/              # Custom hooks reutilizáveis
│   ├── useContextoCliente.ts
│   ├── useContextoConsulta.ts
│   ├── useTema.ts
│   └── useToast.ts
├── types/              # Definições TypeScript
│   ├── models/         # Tipos de domínio
│   ├── services/       # Interfaces de serviços
│   └── *.type.ts       # Tipos específicos
├── utils/              # Funções utilitárias
│   ├── consultaStateMachine.ts  # State machine para transições de consulta
│   ├── filters.ts      # Funções de filtro
│   └── delay.ts        # Simulação de delay
├── constants/          # Constantes da aplicação
├── mocks/              # Dados mock para simulação
├── theme/              # Configuração de tema
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radii.ts
│   └── statusColor.ts
├── navigation/         # Configuração de navegação
│   ├── AppNavigator.tsx
│   ├── DrawerNavigator.tsx
│   └── types.ts
└── domain/             # Lógica de domínio
    └── consulta.ts
```

### Regra de Subcomponentes

- **Componentes globais** (`src/components/`): Usados por múltiplas telas
- **Componentes específicos de tela** (`src/screens/X/components/`): Usados apenas pela tela X
- **Componentes de domínio** (`src/features/X/`): Componentes especializados para um domínio

---

## 🏗️ Decisões Arquiteturais

### Arquitetura em Três Camadas

A aplicação segue um modelo de arquitetura em **3 camadas** para separação de responsabilidades:

```
┌─────────────────────────────────────────┐
│   CAMADA DE APRESENTAÇÃO (Presentation)  │
│  Screens, Components, Hooks, Navigation  │
│  ↓ Depende de tipos de serviço           │
├─────────────────────────────────────────┤
│    CAMADA DE NEGÓCIO (Business)         │
│  Services, Contexts, State Machine      │
│  ↓ Depende de tipos de domínio          │
├─────────────────────────────────────────┤
│      CAMADA DE DADOS (Data)             │
│   Types, Models, Mocks, Constants       │
└─────────────────────────────────────────┘
```

**Regra de Imports:** A camada superior nunca importa da inferior (exceto tipos). Uma tela nunca importa lógica diretamente; sempre via Context + Service.

---

### Princípios SOLID

#### **S — Single Responsibility Principle (SRP)**

Cada serviço e context tem uma responsabilidade única:

- `ClienteService`: Apenas operações de cliente (listar, cadastrar, editar, desativar)
- `ConsultaService`: Apenas operações de consulta (listar, marcar, cancelar)
- `ContextoCliente`: Apenas estado e ações de cliente
- `ContextoConsulta`: Apenas estado e ações de consulta

**Exemplo:**

```typescript
// ✅ Bom: Serviço focado
export interface ServicoCliente {
  listar(
    filtros?: FiltrosCliente,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Cliente>>;
  pegarPorIdentificao(identificacao: string): Promise<Cliente>;
  cadastrar(data: CadastrarClienteDTO): Promise<Cliente>;
  editar(identificacao: string, data: EditarClienteDTO): Promise<Cliente>;
  desativar(identificacao: string): Promise<void>;
}
```

#### **O — Open/Closed Principle (OCP)**

A aplicação é aberta para extensão, fechada para modificação:

- **State Machine**: Transições de consulta centralizadas em `consultaStateMachine.ts`

  ```typescript
  const transicoes: Record<SituacaoConsulta, SituacaoConsulta[]> = {
    [STATUS_CONSULTA.MARCADA]: [STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE, ...],
    // ... demais transições
  };
  ```

  Adicionar novos status requer apenas atualizar este objeto.

- **Componentes com Variants**: Botões, Cards e componentes UI suportam múltiplas variantes sem modificação da base.

#### **L — Liskov Substitution Principle (LSP)**

Variantes de componentes são intercambiáveis:

```typescript
// Diferentes tipos de botão, mesma interface
<Botao variant="primary" onPress={...} />
<Botao variant="secondary" onPress={...} />
<Botao variant="ghost" onPress={...} />
// Todos mantêm contrato esperado (props, comportamento)
```

#### **I — Interface Segregation Principle (ISP)**

Interfaces de serviço são focadas e não forçam dependências desnecessárias:

```typescript
// ✅ Interface segregada
export interface ServicoCliente {
  listar(...): Promise<PaginatedResult<Cliente>>;
  cadastrar(data: CadastrarClienteDTO): Promise<Cliente>;
  // ...
}

// ❌ Evitar: Interface "gorda"
interface SuperServicoCliente {
  listar(...): void;
  cadastrar(...): void;
  listarHistoricoConsultas(...): void;  // ← não pertence aqui
}
```

#### **D — Dependency Inversion Principle (DIP)**

Telas dependem de **tipos de serviço**, não da implementação:

```typescript
// ✅ Tela depende de tipo/interface
export interface ServicoCliente {
  listar(...): Promise<PaginatedResult<Cliente>>;
}

// Tela usa apenas a interface
const { clientes } = useContextoCliente();
const resultado = await servicoCliente.listar();

// ❌ Evitar: Importar implementação diretamente
import { MeuServicoClienteConcreto } from '...';
```

---

### Command Query Separation (CQS)

No **service layer**, métodos são divididos em:

- **Queries** (leitura): Não modificam estado, retornam dados

  ```typescript
  listar(filtros?: FiltrosCliente): Promise<PaginatedResult<Cliente>>;
  pegarPorIdentificao(identificacao: string): Promise<Cliente>;
  ```

- **Commands** (escrita): Modificam estado, idealmente `Promise<void>`
  ```typescript
  cadastrar(data: CadastrarClienteDTO): Promise<Cliente>;  // Retorna para confirmação
  editar(identificacao: string, data: EditarClienteDTO): Promise<Cliente>;
  desativar(identificacao: string): Promise<void>;
  ```

**Benefício:** Código previsível. Ao ver `servicoCliente.listar()`, sabemos que não há side-effects.

---

### State Machine de Consulta

Transições de status de consulta são centralizadas em função pura:

**Arquivo:** `src/utils/consultaStateMachine.ts`

```typescript
const transicoes: Record<SituacaoConsulta, SituacaoConsulta[]> = {
  [STATUS_CONSULTA.MARCADA]: [
    STATUS_CONSULTA.CONFIRMADA,
    STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
    STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
  ],
  [STATUS_CONSULTA.CONFIRMADA]: [
    STATUS_CONSULTA.REALIZADA,
    STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
  ],
  [STATUS_CONSULTA.REALIZADA]: [STATUS_CONSULTA.ENCERRADA],
  [STATUS_CONSULTA.ENCERRADA]: [],
  // ...
};

export const canTransition = (
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): boolean => transicoes[de].includes(para);

export const assertTransition = (
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): void => {
  if (!canTransition(de, para)) {
    throw new TransicaoConsultaInvalidaError(de, para);
  }
};
```

**Benefícios:**

- Transições inválidas são **impossíveis** (não apenas desaconselhadas)
- Fácil adicionar novos status
- Testável como função pura
- Documentação clara do fluxo

---

### Composição em UI

Componentes são compostos, não herdados:

```typescript
// ✅ Composição
<Card>
  <Texto weight="bold">Título</Texto>
  <Divisor />
  <Botao>Ação</Botao>
</Card>

// ❌ Evitar: Herança
class CardComTitulo extends Card {
  renderizarTitulo() { /* ... */ }
}
```

**Vantagens:** Flexibilidade, reutilização, evita hierarquias profundas.

---

### TypeScript Strict Mode

Configuração `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Habilitado:**

- `strictNullChecks`: Detecta `null/undefined` precocemente
- `strictFunctionTypes`: Funções type-safe
- `strictBindCallApply`: `.call()` e `.apply()` seguros

**Por que importa:**

- Reduz bugs em runtime
- Melhor autocompletion no IDE
- Código mais legível (tipos servem como documentação)
- Refatorações seguras

---

## 🗺️ Mapa de Navegação

```
Navegação (DrawerNavigator)
├── TelaLogin (Stack raiz - autenticação)
├── TelaCliente (Screen drawer)
│   └── Drawer: Listar clientes
├── Consultas (Stack drawer)
│   ├── MarcarConsultaScreen
│   │   ├── Step 1: Seleção de Cliente
│   │   ├── Step 2: Seleção de Especialidade
│   │   ├── Step 3: Seleção de Médico
│   │   ├── Step 4: Seleção de Data/Hora
│   │   └── Step 5: Resumo e Confirmação
│   ├── ConfirmarConsultasScreen
│   ├── CancelarConsultasScreen
│   └── TelaShowcase (desenvolvimento)
└── ContextoToast (global)
```

---

## 👥 Equipe

- **Desenvolvedor:** [Beatriz Silva de Camargo](https://github.com/bibiritriz)
- **Desenvolvedor:** [Isaque Batistta](https://github.com/IsaqueBatist)
- **Desenvolvedor:** [ Ivo Souza Araujo ](https://github.com/ivoosa7)

---

## 📝 Notas de Desenvolvimento

### Estrutura de Testes

- State Machine: `src/utils/consultaStateMachine.test.ts`
- Testes unitários de transições de status

### Configuração de Lint

- ESLint + Prettier configurados
- TypeScript Strict Mode ativado

### Convenções de Código

- Imports agrupados: react, react-native, dependências, arquivos locais
- Componentes nomeados com extensão `.tsx`
- Services nomeados com `.service.ts`
- Contexts nomeados com `Contexto*.tsx`
- Tipos nomeados com `.type.ts`

---

## 🔗 Recursos

- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## 📄 Licença

Projeto educacional - Sem licença específica.

---

**Última atualização:** Maio de 2026
