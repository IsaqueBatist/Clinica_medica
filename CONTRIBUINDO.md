# 🤝 Guia de Contribuição

Obrigado por se interessar em contribuir para o projeto **Clínica Médica**! Este guia apresenta as diretrizes de contribuição.

---

## 📋 Antes de Começar

1. Leia [README.md](./README.md) — Entenda o projeto
2. Leia [ARQUITETURA.md](./ARQUITETURA.md) — Entenda as decisões de design
3. Leia [DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md) — Índice de recursos

---

## 🏗️ Arquitetura & Padrões

### Respeitar Arquitetura em 3 Camadas

```
Presentation (telas, componentes)
    ↓ (depende de tipos)
Business (services, contexts)
    ↓ (depende de tipos)
Data (types, models, constants)
```

**Regra:** Camada superior **nunca importa implementação** da inferior.

### Aplicar SOLID

- **SRP:** Cada service/context tem uma responsabilidade
- **OCP:** Adicione novas features sem modificar código existente
- **LSP:** Variantes de componente devem ser intercambiáveis
- **ISP:** Interfaces focadas, sem overhead
- **DIP:** Dependa de abstrações (interfaces), não de implementações

### State Machine para Transições

Se sua feature envolve múltiplos estados, use state machine:

```typescript
// ✅ Bom
const transicoes: Record<Estado, Estado[]> = {
  /* ... */
};
export const canTransition = (de, para) => transicoes[de].includes(para);

// ❌ Evitar
if (estado === "X") {
  /* fazer algo */
}
```

---

## 📝 Convenções de Código

### Nomeação de Arquivos

| Tipo        | Padrão                   | Exemplo                     |
| ----------- | ------------------------ | --------------------------- |
| Componentes | `NomeComponente.tsx`     | `BotaoPrimario.tsx`         |
| Services    | `NomeService.service.ts` | `ClienteService.service.ts` |
| Contexts    | `ContextoNome.tsx`       | `ContextoCliente.tsx`       |
| Tipos       | `nome.type.ts`           | `cliente.type.ts`           |
| Hooks       | `useNome.ts`             | `useContextoCliente.ts`     |
| Utilitários | `nome.ts`                | `delay.ts`                  |
| Testes      | `arquivo.test.ts`        | `stateMachine.test.ts`      |

### Imports

Agrupar em ordem:

```typescript
// 1. React/React Native
import React, { useState } from "react";
import { View, Text } from "react-native";

// 2. Dependências externas
import { useNavigation } from "@react-navigation/native";

// 3. Tipos e interfaces
import type { Cliente } from "../types/models/cliente.type";

// 4. Services, contexts, hooks
import { servicoCliente } from "../services";
import { useContextoCliente } from "../hooks";

// 5. Componentes
import { Botao } from "../components/ui/Botao";
import { Card } from "../components/ui/Card";

// 6. Utilitários
import { delay } from "../utils/delay";
```

### TypeScript

- **Sempre use tipos explícitos:**

  ```typescript
  // ✅ Bom
  const clientes: Cliente[] = [];
  const id: string = "CLI001";

  // ❌ Evitar
  const clientes = [];
  const id = "CLI001";
  ```

- **Interfaces para contratos:**

  ```typescript
  // ✅ Bom
  export interface ServicoCliente {
    listar(...): Promise<PaginatedResult<Cliente>>;
  }

  // ❌ Evitar
  export type ServicoCliente = {
    listar: (...) => Promise<PaginatedResult<Cliente>>;
  };
  ```

---

## ✅ Checklist de Contribuição

Antes de fazer commit:

- [ ] Código segue convenções acima
- [ ] Não há `console.log` ou código temporário
- [ ] TypeScript compila sem erros (`strict: true`)
- [ ] ESLint passa (`npm run lint`)
- [ ] Prettier formatou o código
- [ ] Testes unitários adicionados (se aplicável)
- [ ] Documentação atualizada (inline + README/ARQUITETURA)
- [ ] Commit message é clara e descritiva

---

## 🔄 Fluxo de Contribuição

### 1. Preparar Feature

```bash
# Atualizar do remote
git fetch origin

# Criar branch
git checkout -b feat/minha-feature
```

### 2. Desenvolver

```bash
# Rodar app em desenvolvimento
npm start

# Fazer mudanças
# ...

# Verificar lint
npm run lint  # (se existir script)
```

### 3. Testar

```bash
# Executar em emulador
npm run android
# ou
npm run ios
# ou
npm run web
```

### 4. Documentar

- Adicionar comentários inline se lógica complexa
- Atualizar README/ARQUITETURA se mudar arquitetura
- Adicionar JSDoc em funções/interfaces públicas

```typescript
/**
 * Valida transição entre estados de consulta.
 * @param de - Estado atual
 * @param para - Estado de destino
 * @throws TransicaoConsultaInvalidaError se transição inválida
 */
export function assertTransition(
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): void {
  // ...
}
```

### 5. Commit

```bash
git add .
git commit -m "feat: adicionar feature X

- Descrição curta e clara
- Pode ter múltiplas linhas
- Refer issue se houver: closes #123

Co-authored-by: Seu Nome <seu.email@example.com>"
```

**Formato de commit:**

- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Mudanças em documentação
- `refactor:` Refatoração sem mudança de behavior
- `test:` Adicionar/modificar testes
- `style:` Formatação, lint (sem logic changes)
- `chore:` Dependências, build, etc

### 6. Enviar

```bash
git push origin feat/minha-feature
```

Criar pull request no GitHub com:

- Descrição clara do que foi mudado
- Por que foi mudado
- Screenshots (se UI)
- Referência a issues relacionadas

---

## 🐛 Reportar Bugs

1. Verificar se bug já foi reportado (issues)
2. Criar nova issue com:
   - Descrição clara
   - Passos para reproduzir
   - Comportamento esperado vs observado
   - Seu ambiente (device, versão Expo, etc)

---

## 💡 Adicionar Feature Nova

### 1. Planejar

- Discussão no README/ARQUITETURA?
- Afeta múltiplas camadas?
- É um novo serviço? Novo context?

### 2. Estrutura Recomendada

**Novo domínio (ex: Relatórios):**

```
src/
├── services/RelatoriossService.service.ts
├── types/
│   ├── models/relatorio.type.ts
│   └── services/RelatoriosService.service.type.ts
├── contexts/ContextoRelatorios.tsx
├── features/relatorios/
│   ├── ItemListaRelatorio.tsx
│   └── GraficoRelatorio.tsx
├── screens/Relatorios/
│   ├── TelaListarRelatorios.tsx
│   └── components/
└── mocks/relatorios.ts
```

### 3. Adicionar Service

```typescript
// src/types/services/RelatoriosService.service.type.ts
export interface ServicoRelatorios {
  listar(filtros?: FiltrosRelatorio): Promise<Relatorio[]>;
  gerar(data: GerrarRelatorioDTO): Promise<Relatorio>;
}

// src/services/RelatoriosService.service.ts
export const servicoRelatorios: ServicoRelatorios = {
  async listar() {
    /* ... */
  },
  async gerar() {
    /* ... */
  },
};
```

### 4. Adicionar Context

```typescript
// src/contexts/ContextoRelatorios.tsx
interface ValorContextoRelatorios {
  relatorios: Relatorio[];
  carregando: boolean;
  // ... ações
}

export const ContextoRelatorios = React.createContext<ValorContextoRelatorios | undefined>(undefined);

export function ProvedorRelatorios({ children }) {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);

  return (
    <ContextoRelatorios.Provider value={{ relatorios, /* ... */ }}>
      {children}
    </ContextoRelatorios.Provider>
  );
}
```

### 5. Atualizar Providers

```typescript
// src/contexts/ProvedoresApp.tsx
export function ProvedoresApp({ children }) {
  return (
    <ProvedorTema>
      <ProvedorToast>
        <ProvedorCliente>
          <ProvedorMedico>
            <ProvedorEspecialidade>
              <ProvedorConsulta>
                <ProvedorRelatorios>  {/* ← Adicionar */}
                  {children}
                </ProvedorRelatorios>
              </ProvedorConsulta>
            </ProvedorEspecialidade>
          </ProvedorMedico>
        </ProvedorCliente>
      </ProvedorToast>
    </ProvedorTema>
  );
}
```

### 6. Criar Hook

```typescript
// src/hooks/useContextoRelatorios.ts
export function useContextoRelatorios() {
  const context = useContext(ContextoRelatorios);
  if (!context) {
    throw new Error(
      "useContextoRelatorios deve ser usado dentro de ProvedorRelatorios",
    );
  }
  return context;
}
```

### 7. Usar em Tela

```typescript
// src/screens/Relatorios/TelaListarRelatorios.tsx
export function TelaListarRelatorios() {
  const { relatorios, carregando } = useContextoRelatorios();

  // usar...
}
```

---

## 🧪 Testes

### State Machine

```typescript
import { canTransition } from "../utils/consultaStateMachine";

describe("consultaStateMachine", () => {
  it("deve permitir transição MARCADA → CONFIRMADA", () => {
    expect(
      canTransition(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CONFIRMADA),
    ).toBe(true);
  });

  it("não deve permitir transição inválida", () => {
    expect(
      canTransition(STATUS_CONSULTA.ENCERRADA, STATUS_CONSULTA.MARCADA),
    ).toBe(false);
  });
});
```

### Services

```typescript
import { servicoCliente } from "../services";

describe("servicoCliente", () => {
  it("deve retornar lista paginada", async () => {
    const resultado = await servicoCliente.listar({}, 1, 10);
    expect(resultado.data).toBeInstanceOf(Array);
    expect(resultado.meta.currentPage).toBe(1);
  });
});
```

---

## 📞 Dúvidas?

1. Verificar [DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md)
2. Abrir issue com tag `question`
3. Contatar [Isaque Baptista](https://github.com/IsaqueBatist)

---

## 🎯 Prioridades de Contribuição

1. **Bugs críticos** (app crash, dados perdidos)
2. **Features solicitadas** (roadmap)
3. **Melhorias arquiteturais** (refactoring)
4. **Testes** (aumentar cobertura)
5. **Documentação** (clareza, exemplos)

---

**Obrigado por contribuir!** 🙌
