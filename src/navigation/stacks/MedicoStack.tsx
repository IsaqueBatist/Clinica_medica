import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Routes } from "../../constants/routes";
import { AppHeader } from "../components/AppHeader";
import type { MedicosStackParamList } from "../types";

// Importe a tela de listagem que acabamos de criar (Ajuste o caminho se precisar)
import { TelaListarMedico } from "../../screens/Medico/TelaListarMedico";
// Importe o Placeholder para as telas que ainda não criamos
import { TelaFormularioMedico } from "../../screens/Medico/TelaFormularioMedico";
import { TelaDetalheMedico } from "../../screens/Medico/TelaDetalheMedico";

const Stack = createNativeStackNavigator<MedicosStackParamList>();

export function MedicosStack() {
    return (
        <Stack.Navigator
            screenOptions={{ header: (props) => <AppHeader {...props} /> }}
        >
            <Stack.Screen
                name={Routes.ListarMedicos}
                component={TelaListarMedico}
                options={{ title: "Médicos" }}// Deixe false pois a sua TelaListarMedicos não precisa de um segundo Header
            />
            <Stack.Screen
                name={Routes.CadastroMedico}
                component={TelaFormularioMedico} // Quando criar a TelaFormularioMedicos, troque aqui!
                options={{ title: "Cadastrar médico" }}
            />
            <Stack.Screen
                name={Routes.DetalheMedico}
                component={TelaDetalheMedico} // Quando criar a TelaFormularioMedicos, troque aqui!
                options={{ title: "Detalhes do médico" }}
            />
        </Stack.Navigator>
    );
}