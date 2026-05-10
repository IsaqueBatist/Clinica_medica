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
import { useContextoAuth } from "../contexts/ContextoAuth";
import { StackLogin } from "./stacks/LoginStack";
import { TelaShowcase } from "../screens";

export function AppNavigator() {
  const { tema, modo } = useTema();
  const { isAuthenticated, carregando } = useContextoAuth();

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

  // Evita renderizar as telas antes da verificação do AsyncStorage terminar
  if (carregando) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={temaNavegacao}>
        {isAuthenticated ? <DrawerNavigator /> : <TelaShowcase />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
