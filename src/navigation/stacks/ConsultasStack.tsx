import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TelaPlaceholder } from "../../screens/Placeholder";
import { TelaConsultaMarcacao } from "../../screens/consulta/TelaConsultaMarcacao";
import { ConfirmarConsultasScreen } from "../../screens/consulta/ConfirmarConsultasScreen";
import { CancelarConsultasScreen } from "../../screens/consulta/CancelarConsultasScreen";
import { Routes } from "../../constants/routes";
import { AppHeader } from "../components/AppHeader";
import type { ConsultasStackParamList } from "../types";

const Stack = createNativeStackNavigator<ConsultasStackParamList>();

export function ConsultasStack() {
  return (
    <Stack.Navigator
      screenOptions={{ header: (props) => <AppHeader {...props} /> }}
    >
      <Stack.Screen
        name={Routes.ListarConsultas}
        component={TelaPlaceholder}
        options={{ title: "Consultas" }}
      />
      <Stack.Screen
        name={Routes.ConsultaMarcacao}
        component={TelaConsultaMarcacao}
        options={{ title: "Marcar consulta", headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ConsultaConfirmacao}
        component={ConfirmarConsultasScreen}
        options={{ title: "Confirmar consulta", headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ConsultaRealizacao}
        component={TelaPlaceholder}
        options={{ title: "Realizar consulta" }}
      />
      <Stack.Screen
        name={Routes.ConsultaEncerramento}
        component={TelaPlaceholder}
        options={{ title: "Encerrar consulta" }}
      />
      <Stack.Screen
        name={Routes.ConsultaCancelamento}
        component={CancelarConsultasScreen}
        options={{ title: "Cancelar consulta", headerShown: false }}
      />
      <Stack.Screen
        name={Routes.DetalheConsulta}
        component={TelaPlaceholder}
        options={{ title: "Detalhe" }}
      />
    </Stack.Navigator>
  );
}
