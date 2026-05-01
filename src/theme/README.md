# Tema — guia de uso

> Quando usar cada token. Mantém este arquivo curto: 1 exemplo por token,
> ele é referência rápida, não documentação extensa.

## Setup

```tsx
// App.tsx
import { ProvedorTema } from "@/theme";

export default function App() {
  return (
    <ProvedorTema modoInicial="claro">
      <RootNavigator />
    </ProvedorTema>
  );
}
```

## Consumo em componente

```tsx
import { useTema } from "@/hooks/useTema";

function Card({ children }) {
  const { tema } = useTema();
  return (
    <View
      style={{
        backgroundColor: tema.cores.fundo.superficie,
        padding: tema.espacamento.lg,
        borderRadius: tema.raios.lg,
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
      }}
    >
      {children}
    </View>
  );
}
```

## Toggle de tema

```tsx
function AlternadorTema() {
  const { modo, alternar } = useTema();
  return <Button title={modo} onPress={alternar} />;
}
```

---

## Quando usar cada token de cor

### `fundo`

| Token              | Quando usar                                   |
| ------------------ | --------------------------------------------- |
| `fundo.primario`   | Fundo de tela (canvas)                        |
| `fundo.secundario` | Surface alternativa em layouts com hierarquia |
| `fundo.superficie` | Cards, modais, bottom sheets                  |
| `fundo.suave`      | Chips, inputs disabled, hover states neutros  |

### `texto`

| Token               | Quando usar                                                   |
| ------------------- | ------------------------------------------------------------- |
| `texto.primario`    | Texto principal (corpo de leitura, títulos)                   |
| `texto.secundario`  | Labels, descrições, texto de apoio                            |
| `texto.suave`       | Captions, timestamps, helper text de input                    |
| `texto.inverso`     | Texto em superfícies escuras (toasts, tooltips no modo claro) |
| `texto.sobreMarca`  | Texto sobre `marca.primario` (botões CTA)                     |

### `borda`

| Token          | Quando usar                                    |
| -------------- | ---------------------------------------------- |
| `borda.padrao` | Borda padrão de cards, separadores, divisores  |
| `borda.forte`  | Borda de input, separadores enfáticos          |
| `borda.foco`   | Ring de foco em inputs e elementos interativos |

### `status`

| Token            | Quando usar                                 |
| ---------------- | ------------------------------------------- |
| `status.sucesso` | Confirmação, sucesso, slot livre            |
| `status.erro`    | Erro, ação destrutiva, cancelamento crítico |
| `status.aviso`   | Atenção, cancelamento comum                 |
| `status.info`    | Informação neutra, slot agendado            |

### `marca`

| Token              | Quando usar                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `marca.primario`   | Botão primário (passa AA contra texto branco). Cor de ação.                                                              |
| `marca.secundario` | Cor de marca pura — ícone do app, accent decorativo, ilustrações. **Não use para texto sobre branco** (falha contraste). |

---

## Status do domínio

Cores específicas de status são resolvidas via `getStatusColors`:

```tsx
import { useTema } from "@/hooks/useTema";
import { getStatusColors, type AppointmentStatus } from "@/theme";

function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const { tema, modo } = useTema();
  const statusColors = getStatusColors(tema.cores, modo);
  return (
    <View
      style={{
        backgroundColor: statusColors.appointment[status],
        paddingHorizontal: tema.espacamento.sm,
        paddingVertical: tema.espacamento.xs,
        borderRadius: tema.raios.sm,
      }}
    >
      <Text style={{ color: tema.cores.texto.sobreMarca }}>
        {appointmentStatusLabel[status]}
      </Text>
    </View>
  );
}
```

### Mapeamentos disponíveis

- `slot[L|M|C|X|B]` — slot da agenda
- `appointment[Marcada|Confirmada|Realizada|Encerrada|Cancelada*]` — consulta
- `entity[ativo|inativo]` — cliente/médico
- `cancellation[cliente|medico|naoComparecimento]` — tipo de cancelamento

---

## Espaçamento

Múltiplos de 4 apenas. Se precisar de 6 ou 18, use 4 ou 16. Não invente.

| Chave    | Valor | Uso típico                             |
| -------- | ----- | -------------------------------------- |
| `xs`     | 4     | gap interno fino, padding de chip      |
| `sm`     | 8     | gap entre ícone e label                |
| `md`     | 12    | padding interno de input               |
| `lg`     | 16    | margem de tela mobile, padding de card |
| `xl`     | 24    | espaço entre seções                    |
| `2xl`    | 32    | espaço grande entre blocos             |
| `3xl`    | 48    | margem de hero / topo de tela          |

---

## Tipografia

```tsx
const { tipografia } = useTema().tema;

const styles = {
  fontSize: tipografia.tamanho.corpo,
  lineHeight: tipografia.alturaLinha.corpo,
  fontWeight: tipografia.peso.medio,
  fontFamily: tipografia.familia.sans,
};
```

| Tamanho   | Uso                                |
| --------- | ---------------------------------- |
| `legenda` | Helper text, timestamps, microtext |
| `corpo`   | Texto padrão de UI e leitura       |
| `h3`      | Subseção, card title               |
| `h2`      | Seção principal                    |
| `h1`      | Título de tela, números grandes    |

---

## Raios

| Chave      | Valor | Uso                         |
| ---------- | ----- | --------------------------- |
| `nenhum`   | 0     | Linhas, divisores           |
| `sm`       | 4     | Chips, badges pequenos      |
| `md`       | 8     | Inputs                      |
| `lg`       | 12    | **Botões e cards (padrão)** |
| `completo` | 9999  | Avatares, pills, FAB        |

---

## Anti-padrões

❌ **Não faça isso:**

```tsx
<View style={{ backgroundColor: '#FFFFFF' }} />              // hex hardcoded
<View style={{ padding: 14 }} />                             // valor fora da escala
<Text style={{ color: tema.cores.marca.secundario }} />      // marca.secundario em texto sobre branco (falha contraste)
```

✅ **Faça isso:**

```tsx
<View style={{ backgroundColor: tema.cores.fundo.superficie }} />
<View style={{ padding: tema.espacamento.lg }} />
<Text style={{ color: tema.cores.marca.primario }} />        // brand acessível
```
