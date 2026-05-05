import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";

import { useTema } from "../hooks/useTema";
import { DrawerNavigator } from "./DrawerNavigator";

/**
 * AppNavigator — raiz da navegação autenticada.
 *
 * Responsabilidades:
 *  - Montar o `GestureHandlerRootView` (necessário para o swipe do Drawer).
 *  - Mapear nosso `ProvedorTema` para o `Theme` do react-navigation, evitando
 *    o flash de fundo branco entre transições.
 *  - Hospedar o `NavigationContainer` único do app.
 *
 * Quando vier autenticação real (NAV-04?), trocaremos `<DrawerNavigator />`
 * por um Stack raiz que escolhe entre Auth/App, sempre dentro deste mesmo
 * `NavigationContainer`.
 */
export interface PropsAppNavigator {
  aoSair?: () => void;
}

export function AppNavigator({ aoSair }: PropsAppNavigator) {
  const { tema, modo } = useTema();

  const temaNavegacao: Theme = {
    ...(modo === "escuro" ? DarkTheme : DefaultTheme),
    colors: {
      ...(modo === "escuro" ? DarkTheme.colors : DefaultTheme.colors),
      primary: tema.cores.marca.primario,
      background: tema.cores.fundo.primario,
      card: tema.cores.fundo.superficie,
      text: tema.cores.texto.primario,
      border: tema.cores.borda.padrao,
      notification: tema.cores.status.erro,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={temaNavegacao}>
        <DrawerNavigator aoSair={aoSair} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
