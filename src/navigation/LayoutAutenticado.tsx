import React from "react";
import { View } from "react-native";
import { GlobalBarraInferior } from "../components/GlobalBarraInferior";
import { DrawerNavigator } from "./DrawerNavigator";

interface PropsLayoutAutenticado {
  rotaAtiva: string;
}

/**
 * LayoutAutenticado
 *
 * Recebe rotaAtiva do AppNavigator (via onStateChange do NavigationContainer)
 * e passa para GlobalBarraInferior como prop — evitando que a barra
 * tente ler o contexto de navegação diretamente.
 */
export function LayoutAutenticado({ rotaAtiva }: PropsLayoutAutenticado) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerNavigator />
      <GlobalBarraInferior rotaAtiva={rotaAtiva} />
    </View>
  );
}