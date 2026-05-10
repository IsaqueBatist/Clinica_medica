import React from "react";
import { View } from "react-native";
import { GlobalBarraInferior } from "../components/GlobalBarraInferior";
import { DrawerNavigator } from "./DrawerNavigator";
import { useTema } from "../hooks";

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
  const { tema } = useTema();
  return (
    <View style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}>
      <DrawerNavigator />
      <GlobalBarraInferior rotaAtiva={rotaAtiva} />
    </View>
  );
}
