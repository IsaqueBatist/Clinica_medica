import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationState,
  type Theme,
} from "@react-navigation/native";

import { useTema } from "../hooks/useTema";
import { useContextoAuth } from "../contexts/ContextoAuth";
import { LayoutAutenticado } from "./LayoutAutenticado";
import { StackLogin } from "./stacks/LoginStack";
import { Routes } from "../constants/routes";

/**
 * Extrai o nome da rota raiz ativa de qualquer estado de navegação.
 * Lemos aqui, fora de qualquer hook de navegação, e passamos como prop.
 */
function obterRotaAtiva(state: NavigationState | undefined): string {
  if (!state) return Routes.DashboardStack;
  const rota = state.routes[state.index];
  return rota?.name ?? Routes.DashboardStack;
}

export function AppNavigator() {
  const { tema, modo } = useTema();
  const { isAuthenticated, carregando } = useContextoAuth();

  // Rota ativa controlada pelo onStateChange do NavigationContainer.
  // Isso evita que qualquer filho precise chamar useNavigationState
  // diretamente — que falha na web antes do navigator inicializar.
  const [rotaAtiva, setRotaAtiva] = useState<string>(Routes.DashboardStack);

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

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: tema.cores.fundo.primario,
        }}
      >
        <ActivityIndicator size="large" color={tema.cores.marca.primario} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        theme={temaNavegacao}
        onStateChange={(state) => {
          // Chamado sempre que a rota muda — estado já estável aqui,
          // sem risco de contexto não inicializado.
          setRotaAtiva(obterRotaAtiva(state as NavigationState));
        }}
      >
        {isAuthenticated ? (
          <LayoutAutenticado rotaAtiva={rotaAtiva} />
        ) : (
          <StackLogin />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}