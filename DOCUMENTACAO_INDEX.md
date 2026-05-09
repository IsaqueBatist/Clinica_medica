# 📚 Índice de Documentação

Bem-vindo à documentação do projeto **Clínica Médica**. Aqui você encontra links rápidos para tudo que precisa saber.

---

## 🚀 Começar Rápido

1. **Primeira vez?** → Leia [README.md](./README.md)
   - O que é o projeto
   - Como instalar e rodar
   - Stack tecnológica

2. **Quer entender a arquitetura?** → Leia [ARQUITETURA.md](./ARQUITETURA.md)
   - Decisões arquiteturais detalhadas (ADRs)
   - Por que escolhemos cada tecnologia/padrão
   - Roadmap futuro

3. **Precisa adicionar screenshots?** → Leia [SCREENSHOTS_GUIA.md](./SCREENSHOTS_GUIA.md)
   - Como capturar screenshots
   - Onde colocá-las
   - Validação

---

## 📖 Documentação por Tópico

### Arquitetura & Padrões

- **Arquitetura em 3 Camadas:** [ARQUITETURA.md#ADR-001](./ARQUITETURA.md)
- **State Management:** [ARQUITETURA.md#ADR-002](./ARQUITETURA.md) (Context API)
- **Services & Negócio:** [ARQUITETURA.md#ADR-003](./ARQUITETURA.md)
- **State Machine:** [ARQUITETURA.md#ADR-004](./ARQUITETURA.md)
- **Composição vs Herança:** [ARQUITETURA.md#ADR-005](./ARQUITETURA.md)

### SOLID & Design Patterns

- **SOLID Principles** → [README.md#Princípios-SOLID](./README.md)
  - SRP (Single Responsibility)
  - OCP (Open/Closed)
  - LSP (Liskov Substitution)
  - ISP (Interface Segregation)
  - DIP (Dependency Inversion)
- **Command Query Separation:** [ARQUITETURA.md#ADR-007](./ARQUITETURA.md)

### Setup & Desenvolvimento

- **Pré-requisitos:** [README.md#Pré-requisitos](./README.md)
- **Instalação:** [README.md#Instalação](./README.md)
- **Como Rodar:** [README.md#Como-Rodar](./README.md)

### Estrutura do Projeto

- **Estrutura de Pastas:** [README.md#Estrutura-de-Pastas](./README.md)
- **Navegação (Rotas):** [README.md#Mapa-de-Navegação](./README.md)

### Screenshots

- **Guia Completo:** [SCREENSHOTS_GUIA.md](./SCREENSHOTS_GUIA.md)
- **Visualizar no README:** [README.md#Screenshots](./README.md)

---

## 🏗️ Estrutura de Código Relevante

```
src/
├── components/               # Componentes reutilizáveis
├── screens/                  # Telas da aplicação
├── features/                 # Componentes específicos de domínio
├── services/                 # Lógica de negócio
│   ├── ClienteService.service.ts
│   ├── ConsultaService.service.ts
│   ├── MedicoService.service.ts
│   └── EspecialidadeService.service.ts
├── contexts/                 # State management
│   ├── ContextoCliente.tsx
│   ├── ContextoConsulta.tsx
│   ├── ContextoMedico.tsx
│   └── ContextoEspecialidade.tsx
├── utils/
│   └── consultaStateMachine.ts  # State machine (transições)
├── types/
│   ├── models/               # Tipos de domínio
│   └── services/             # Interfaces de serviços
├── theme/                    # Tema visual
└── navigation/               # Configuração de rotas
```

---

## ❓ Perguntas Frequentes

### Por que 3 camadas?

[ARQUITETURA.md#ADR-001](./ARQUITETURA.md) — Separação de responsabilidades, testes independentes, fácil manutenção.

### Como adicionar um novo serviço?

1. Definir interface em `src/types/services/MeuServiço.service.type.ts`
2. Implementar em `src/services/MeuServiço.service.ts`
3. Exportar em `src/services/index.ts`
4. Usar em componentes via Context ou hooks

### State machine — quando usar?

[ARQUITETURA.md#ADR-004](./ARQUITETURA.md) — Para qualquer entidade com múltiplos estados e regras de transição. No projeto: consultas.

### Como testar?

- Services: Testes unitários (mocks implementam interfaces)
- State Machine: Testes de transições válidas/inválidas
- Componentes: Testes de renderização

---

## 🔗 Links Úteis

### Tecnologias Utilizadas

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Padrões & Arquitetura

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [State Machines Intro](https://statecharts.dev/)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 👥 Equipe

- **Desenvolvedor:** [Isaque Baptista](https://github.com/IsaqueBatist)

---

## 📝 Versionamento de Documentação

| Arquivo               | Última Atualização | Status   |
| --------------------- | ------------------ | -------- |
| README.md             | Maio 2026          | ✅ Ativo |
| ARQUITETURA.md        | Maio 2026          | ✅ Ativo |
| SCREENSHOTS_GUIA.md   | Maio 2026          | ✅ Ativo |
| DOCUMENTACAO_INDEX.md | Maio 2026          | ✅ Ativo |

---

**💡 Dica:** Comece pelo [README.md](./README.md) e aprofunde em [ARQUITETURA.md](./ARQUITETURA.md) conforme necessário.
