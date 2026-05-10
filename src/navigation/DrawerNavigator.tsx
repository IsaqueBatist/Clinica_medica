import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { useTema } from "../hooks/useTema";
import { Routes } from "../constants/routes";
import { CustomDrawerContent } from "./components/CustomDrawerContent";
import { DashboardStack } from "./stacks/DashboardStack";
import { ClientesStack } from "./stacks/ClientesStack";
import { ConsultasStack } from "./stacks/ConsultasStack";
import type { DrawerParamList } from "./types";

const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * DrawerNavigator — gaveta principal do app autenticado.
 *
 * Cada `Drawer.Screen` registra uma SEÇÃO inteira (não uma tela única). Cada
 * seção é um Stack próprio — `DashboardStack`, `ClientesStack`, `ConsultasStack`.
 * As telas individuais vivem dentro desses Stacks (ver `stacks/*.tsx`).
 *
 * `headerShown: false` desliga o header do Drawer — quem desenha o header é o
 * `AppHeader` aplicado em cada Stack via `screenOptions.header`. Decisão NAV-01.
 */
export interface PropsDrawerNavigator {
  aoSair?: () => void;
}

export function DrawerNavigator({ aoSair }: PropsDrawerNavigator) {
  const { tema } = useTema();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: tema.cores.fundo.superficie,
          width: 280,
        },
        drawerType: "front",
        swipeEdgeWidth: 60,
        sceneStyle: { backgroundColor: tema.cores.fundo.primario },
      }}
    >
      <Drawer.Screen name={Routes.DashboardStack} component={DashboardStack} />
      <Drawer.Screen name={Routes.ClientesStack} component={ClientesStack} />
      <Drawer.Screen name={Routes.ConsultasStack} component={ConsultasStack} />
    </Drawer.Navigator>
  );
}
