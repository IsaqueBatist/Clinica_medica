import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { TelaPlaceholder } from "../screens/Placeholder";
import { useTema } from "../hooks/useTema";
import { Routes } from "../constants/routes";
import { CustomDrawerContent } from "./components/CustomDrawerContent";
import type { DrawerParamList } from "./types";

const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * DrawerNavigator — gaveta principal do app autenticado.
 *
 * Cada `Drawer.Screen` registra uma rota. O componente apontado é hoje a
 * `TelaPlaceholder`; quando você for implementar uma seção, troque o
 * `component={TelaPlaceholder}` da linha correspondente pelo seu componente
 * real (ou por um Stack aninhado, ver `README.md`).
 *
 * Detalhe importante: o Drawer do react-navigation é FLAT — todas as rotas
 * (Cadastrar, Listar, ...) são irmãs. A *hierarquia visual* (grupo "Clientes"
 * com filhos "Cadastrar"/"Listar") é puramente do `CustomDrawerContent` e vem
 * de `ENTRADAS_DRAWER` em `types.ts`.
 *
 * `headerShown: false` porque cada tela renderiza o próprio header com o botão
 * de hamburger. Quando viramos Stack, o header passa a ser do Stack — mantém
 * a hierarquia consistente.
 */
export interface PropsDrawerNavigator {
  aoSair?: () => void;
}

export function DrawerNavigator({ aoSair }: PropsDrawerNavigator) {
  const { tema } = useTema();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} aoSair={aoSair} />
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
      <Drawer.Screen name={Routes.Dashboard} component={TelaPlaceholder} />

      <Drawer.Screen name={Routes.CadastroCliente} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ListarClientes} component={TelaPlaceholder} />

      <Drawer.Screen name={Routes.ListarConsultas} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ConsultaMarcacao} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ConsultaConfirmacao} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ConsultaRealizacao} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ConsultaEncerramento} component={TelaPlaceholder} />
      <Drawer.Screen name={Routes.ConsultaCancelamento} component={TelaPlaceholder} />
    </Drawer.Navigator>
  );
}
