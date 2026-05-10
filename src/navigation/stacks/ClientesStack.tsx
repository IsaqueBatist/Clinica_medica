import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TelaPlaceholder } from "../../screens/Placeholder";
import { TelaListarClientes } from "../../screens/Cliente/TelaListarClientes";
import { Routes } from "../../constants/routes";
import { AppHeader } from "../components/AppHeader";
import type { ClientesStackParamList } from "../types";
import { TelaFormularioClientes } from "../../screens/Cliente/TelaFormularioClientes";
import { TelaDetalheCliente } from "../../screens/Cliente/TelaDetalheCliente";

const Stack = createNativeStackNavigator<ClientesStackParamList>();

export function ClientesStack() {
  return (
    <Stack.Navigator
      screenOptions={{ header: (props) => <AppHeader {...props} /> }}
    >
      <Stack.Screen
        name={Routes.CadastroCliente}
        component={TelaFormularioClientes}
        options={{ title: "Cadastrar cliente" }}
      />
      <Stack.Screen
        name={Routes.ListarClientes}
        component={TelaListarClientes}
        options={{ title: "Clientes" }}
      />
      <Stack.Screen
        name={Routes.DetalheCliente}
        component={TelaDetalheCliente}
        options={{ title: "Detalhe do Cliente" }}
      />
    </Stack.Navigator>
  );
}
