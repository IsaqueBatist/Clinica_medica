# Navegação — guia para o desenvolvedor

Este documento explica **como mexer na navegação do app** sem quebrar nada.
Para o panorama conceitual (o que é Drawer, Stack, NavigationContainer), peça
ao Claude no chat — aqui é manual prático.

## Estrutura

```
src/navigation/
  AppNavigator.tsx       ← raiz: GestureHandlerRootView + NavigationContainer
  DrawerNavigator.tsx    ← Drawer + lista de Drawer.Screen (uma por rota)
  types.ts               ← DrawerParamList + ENTRADAS_DRAWER (visual)
  index.ts               ← barrel export
  components/
    CustomDrawerContent.tsx  ← UI da gaveta (grupos hierárquicos)
  README.md              ← você está aqui

src/screens/Placeholder/
  TelaPlaceholder.tsx    ← andaime usado por todas as rotas até virarem reais
```

## Conceito-chave: rotas FLAT, visual hierárquico

O Drawer do react-navigation **não aceita rotas aninhadas**. Todas as rotas
(`CadastroCliente`, `ListarClientes`, `ConsultaMarcacao`, ...) são **irmãs**
no `Drawer.Navigator`.

A hierarquia que você vê na gaveta — `Clientes > Cadastrar / Listar` — vive
**só no visual**, em `ENTRADAS_DRAWER` (`types.ts`). O `CustomDrawerContent`
lê essa estrutura e renderiza grupos colapsáveis. Para o react-navigation,
continua tudo flat.

Consequência prática: ao adicionar uma rota, você mexe em **dois lugares**:
1. `DrawerParamList` + `Drawer.Screen` (registrar a rota).
2. `ENTRADAS_DRAWER` (decidir onde ela aparece visualmente).

## Como trocar uma `TelaPlaceholder` pela sua tela real

Cenário: você criou `TelaCadastroCliente` e quer plugá-la na rota
`CadastroCliente`.

### 1. Crie a tela

```tsx
// src/screens/Clientes/TelaCadastroCliente.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";

import { useTema } from "../../hooks/useTema";
import { BotaoIcone } from "../../components/ui/BotaoIcone";
import { Texto } from "../../components/ui/Texto";
import type { DrawerParamList } from "../../navigation/types";

export function TelaCadastroCliente() {
  const { tema } = useTema();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}>
      <View style={{ flexDirection: "row", padding: tema.espacamento.md, gap: tema.espacamento.sm, alignItems: "center" }}>
        <BotaoIcone
          nomeIcone="menu"
          rotuloAcessivel="Abrir menu"
          onPress={() => navigation.openDrawer()}
        />
        <Texto variante="h2" peso="negrito">Cadastrar cliente</Texto>
      </View>
      {/* seu formulário aqui */}
    </SafeAreaView>
  );
}
```

Não esqueça do barrel:

```ts
// src/screens/Clientes/index.ts
export { TelaCadastroCliente } from "./TelaCadastroCliente";
```

### 2. Plugue no `DrawerNavigator.tsx`

Abra `src/navigation/DrawerNavigator.tsx` e troque a linha correspondente:

```diff
- <Drawer.Screen name={Routes.CadastroCliente} component={TelaPlaceholder} />
+ <Drawer.Screen name={Routes.CadastroCliente} component={TelaCadastroCliente} />
```

E o import no topo:

```ts
import { TelaCadastroCliente } from "../screens/Clientes";
```

Pronto. A rota agora renderiza sua tela; as outras continuam placeholder até
você ir migrando.

## Como adicionar uma rota nova

Cenário: você quer uma rota `EditarCliente` dentro do grupo "Clientes".

### 1. Adicione a constante em `routes.ts`

```ts
// src/constants/routes.ts
export const Routes = {
  // ...
  EditarCliente: "EditarCliente",
} as const;
```

### 2. Adicione em `DrawerParamList` (`types.ts`)

```ts
export type DrawerParamList = {
  // ...
  [Routes.EditarCliente]: { id: string };  // ← com params, se precisar
};
```

`undefined` para rota sem params, `{ id: string }` (ou o que for) para rota
com params. Quem chamar `navigation.navigate(Routes.EditarCliente, { id })`
vai ser obrigado a passar `id` — TS reclama em compilação se faltar.

### 3. Adicione em `ENTRADAS_DRAWER` (`types.ts`)

Encontre o grupo `cliente` e adicione o subitem:

```ts
{
  tipo: "grupo",
  chave: "cliente",
  rotulo: "Clientes",
  icone: "usuario",
  itens: [
    { nome: Routes.CadastroCliente, rotulo: "Cadastrar", icone: "mais" },
    { nome: Routes.ListarClientes, rotulo: "Listar", icone: "menu" },
    { nome: Routes.EditarCliente, rotulo: "Editar", icone: "editar" }, // ← novo
  ],
},
```

### 4. Registre o `Drawer.Screen` em `DrawerNavigator.tsx`

```tsx
<Drawer.Screen name={Routes.EditarCliente} component={TelaEditarCliente} />
```

(ou `component={TelaPlaceholder}` se ainda não criou a tela).

## Como navegar de uma tela para outra

Dentro de qualquer tela registrada:

```tsx
const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

// Ir para outra rota:
navigation.navigate(Routes.ListarClientes);

// Com params (se a rota tiver tipagem `{ id: string }`):
navigation.navigate(Routes.EditarCliente, { id: "abc-123" });

// Abrir/fechar drawer programaticamente:
navigation.openDrawer();
navigation.closeDrawer();
navigation.toggleDrawer();
```

Receber params na tela:

```tsx
import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const route = useRoute<RouteProp<DrawerParamList, "EditarCliente">>();
console.log(route.params.id); // tipado como string
```

## Quando uma seção tem várias telas (Stack aninhado)

"Clientes" não é uma tela só — é lista, cadastro, detalhe, edição. O padrão
correto é ter **uma rota no Drawer apontando para um Stack**, não para uma
tela. O Drawer guarda a *seção*; o Stack guarda a *navegação interna*.

Roteiro (faça quando tiver pelo menos 2 telas reais na seção):

### 1. Crie um arquivo de Stack

```tsx
// src/navigation/stacks/ClientesStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TelaListarClientes } from "../../screens/Clientes/TelaListarClientes";
import { TelaCadastroCliente } from "../../screens/Clientes/TelaCadastroCliente";
import { TelaDetalheCliente } from "../../screens/Clientes/TelaDetalheCliente";
import { Routes } from "../../constants/routes";

export type ClientesStackParamList = {
  [Routes.ListarClientes]: undefined;
  [Routes.CadastroCliente]: undefined;
  [Routes.DetalheCliente]: { id: string };
};

const Stack = createNativeStackNavigator<ClientesStackParamList>();

export function ClientesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={Routes.ListarClientes} component={TelaListarClientes} />
      <Stack.Screen name={Routes.CadastroCliente} component={TelaCadastroCliente} />
      <Stack.Screen name={Routes.DetalheCliente} component={TelaDetalheCliente} />
    </Stack.Navigator>
  );
}
```

### 2. Aponte o Drawer para o Stack

No `DrawerNavigator.tsx` você troca várias `Drawer.Screen` por uma só, que
aponta para o Stack. **Atenção:** isso cria colisão de nomes — o Drawer não
pode ter uma rota `ListarClientes` se o Stack interno também usa esse nome.
Solução: renomeie a rota do Drawer para o nome da *seção*, não da tela.

Adicione em `routes.ts`:
```ts
Clientes: "Clientes",  // nome da seção (rota do Drawer)
```

E em `DrawerParamList` substitua as rotas individuais por uma só:
```ts
[Routes.Clientes]: NavigatorScreenParams<ClientesStackParamList>;
```

E no `Drawer.Navigator`:
```tsx
<Drawer.Screen name={Routes.Clientes} component={ClientesStack} />
```

`ENTRADAS_DRAWER` também muda — em vez de listar `Cadastrar` e `Listar` como
filhos do Drawer, eles viram telas internas do Stack (não aparecem no drawer).
A entrada visual fica:

```ts
{ tipo: "item", nome: Routes.Clientes, rotulo: "Clientes", icone: "usuario" }
```

(Ou seja: o grupo desaparece — quem cuida da navegação interna agora é o Stack,
e o usuário transita por push/back, não pela gaveta.)

Quando você quiser **forçar** abrir uma tela específica do Stack a partir de
outra seção:

```ts
navigation.navigate(Routes.Clientes, {
  screen: Routes.DetalheCliente,
  params: { id: "abc" },
});
```

## Pontos de atenção

| Item | Detalhe |
|------|---------|
| `react-native-gesture-handler` | Importado no topo de `index.ts`. Sem isso, swipe do drawer quebra. |
| Reanimated babel plugin | Já está em `babel.config.js`. Sem ele, app não inicia. |
| `NavigationContainer` único | Só existe um, no `AppNavigator`. Não aninhe outro. |
| `useNavigation` | Só funciona dentro do `NavigationContainer`. `TelaLogin` está fora — não use lá. |
| `headerShown: false` | Cada tela do drawer desenha o próprio header. Se mudar para `true`, vai duplicar. |
| Tema | `AppNavigator` mapeia `ProvedorTema` → `Theme` do RN-Nav. Trocar tema atualiza tudo automaticamente. |

## Checklist rápido — adicionei uma tela, e agora?

- [ ] Constante criada em `src/constants/routes.ts`
- [ ] Tipo adicionado em `DrawerParamList` (`navigation/types.ts`)
- [ ] Entrada adicionada em `ENTRADAS_DRAWER` (`navigation/types.ts`)
- [ ] `Drawer.Screen` registrado em `DrawerNavigator.tsx`
- [ ] Tela importada do barrel correto
- [ ] Reload no Expo (à vezes precisa `--clear` se o cache embromar)
