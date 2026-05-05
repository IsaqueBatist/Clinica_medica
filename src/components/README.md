# Design System — Clínica

> Documentação curta. O código é a fonte da verdade — este arquivo só explica
> o **porquê** das decisões e como organizar trabalho novo.

---

## Estrutura de pastas

```
src/
├── theme/                       # tokens (cores, espaçamento, tipografia, raios)
├── types/paletaCores.type.ts    # forma da paleta — única referência de tipo
├── contexts/
│   ├── ContextoTema.tsx         # provider de tema (claro/escuro)
│   └── ContextoToast.tsx        # provider + queue de toasts
├── hooks/
│   ├── useTema.ts
│   └── useToast.ts
├── components/
│   ├── ui/                      # primitivos sem domínio
│   │   ├── Avatar/  Badge/  Botao/  BotaoIcone/  Card/  Divisor/
│   │   ├── EntradaTexto/  EntradaSelect/  EntradaData/
│   │   ├── CampoFormulario/  Spinner/  Texto/  Icone/
│   ├── feedback/                # estados de fluxo
│   │   ├── EstadoCarregando/  EstadoSucesso/  EstadoErro/  Toast/
│   └── navegacao/               # chrome do app
│       ├── Sidebar/  BarraInferior/
├── features/                    # composites com conhecimento de domínio
│   ├── pessoas/ItemListaPessoa.tsx           # composite genérico
│   ├── clientes/ItemListaCliente.tsx         # adapta Pessoa → Cliente
│   ├── medicos/ItemListaMedico.tsx           # adapta Pessoa → Médico
│   └── consultas/CalendarioDia.tsx
└── screens/                     # telas completas
    ├── Login/
    └── Showcase/                # "stories" de todos os componentes
```

---

## Decisões arquiteturais

### 1. Tokens-first

Componentes **nunca** leem hex direto. Tudo passa por `useTema().tema.cores.*`.
Trocar a paleta vira mudar um arquivo (`theme/colors.ts`) e o app inteiro
respeita. Mesma regra para espaçamento, tipografia e raios.

### 2. Três camadas, fronteiras claras

| Camada       | O que faz                                | O que NÃO faz                            |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| `ui/`        | Primitivos visuais reutilizáveis         | Importar de `features/`, conhecer domínio |
| `feedback/`  | Estados (loading, sucesso, erro, toast)  | Saber qual operação está rodando          |
| `navegacao/` | Sidebar, bottom nav (recebem itens)      | Decidir rotas                             |
| `features/`  | Composites com conhecimento de domínio   | Definir tokens visuais                   |

Regra: sentido de import é sempre `features → components`. Nunca o contrário.

### 3. Naming em pt-BR

Mantemos a convenção do projeto (`Tema`, `Botao`, `Cores`, `Texto`). Reduz
ruído mental para o time e é coerente com modelos de domínio também em
português (`Cliente`, `Medico`, `Consulta`).

### 4. Sem dependências de UI externas

O DS só usa `react`, `react-native`, `react-native-safe-area-context` e
`expo-status-bar` (todos já instalados). Nenhuma dependência adicional.

- **Ícones**: composição de `View`s (ver `ui/Icone`). Decisão consciente: sem
  react-native-svg, sem vector-icons. Suficiente para o conjunto necessário,
  bundle menor, visual coerente entre plataformas.
- **Picker/DatePicker**: implementações próprias com `Modal` e máscara de
  texto. O Picker comunitário e os date pickers nativos têm visual fora do DS
  e adicionam dependências.

### 5. Tema = Provider; Toast = Provider; nada de singletons

Estado vive em context + hook. Permite teste isolado, SSR, e respeita o
boundary do React. Acessar fora do provider lança erro (`fail loud`) — é
melhor do que receber `undefined.cores` em produção.

### 6. Acessibilidade no primitivo, não na feature

Todo componente interativo declara `accessibilityRole`, `accessibilityLabel`,
`accessibilityState` por dentro. Quem usa o `Botao` ou `BotaoIcone` não
precisa lembrar disso.

### 7. Foco em estados

Todo input tem default/foco/erro/desabilitado. Toda ação tem default/loading/
disabled. Toda tela com I/O tem o triplet `EstadoCarregando` →
`EstadoSucesso` | `EstadoErro`. Esses estados não são decoração — são parte
da especificação do componente.

### 8. Granularidade de espaçamento restrita

Múltiplos de 4 (`xs/sm/md/lg/xl/2xl/3xl`). Se o design pedir 14, use 12 ou
16. Não inventamos valores intermediários. Restrição força consistência.

---

## Como adicionar um componente novo

1. **Decidir a camada** (`ui/`, `feedback/`, `navegacao/` ou `features/`).
2. Criar pasta com nome em PascalCase: `MeuComponente/`.
3. Arquivos: `MeuComponente.tsx` + `index.ts` (barrel).
4. Tipar props com `Props<NomeDoComponente>`. Exportar a interface.
5. Consumir tema só via `useTema()` — nunca importe `coresClaras` direto.
6. Adicionar export ao `index.ts` da pasta-camada (`ui/index.ts` etc.).
7. Adicionar uma demo na `TelaShowcase` para visibilidade.

---

## Como adicionar uma cor / token novo

1. Adicione na interface `PaletaCores` (`src/types/paletaCores.type.ts`).
2. Preencha em `coresClaras` **e** `coresEscuras` (`src/theme/colors.ts`).
3. Verifique contraste WCAG AA quando o token for usado em texto.
4. Documente em `src/theme/README.md` na tabela apropriada.

---

## Antipadrões — não faça isso

❌ `<View style={{ backgroundColor: "#fff" }} />` — hex hardcoded.
❌ `style={{ padding: 14 }}` — valor fora da escala.
❌ `import { Botao } from "@/components/ui/Botao/Botao"` — use o barrel.
❌ Texto raw com `<Text>` para conteúdo estilizado — use `<Texto />`.
❌ Componente em `ui/` que importa algo de `features/`.
❌ Estado de loading/erro inline ad-hoc — use `EstadoCarregando` / `EstadoErro`.

✅ Tudo via tokens, via barrels, via primitivos.
