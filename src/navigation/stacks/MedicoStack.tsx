import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Routes } from "../../constants/routes";
import { AppHeader } from "../components/AppHeader";
import type { MedicosStackParamList } from "../types";

// Importe a tela de listagem que acabamos de criar (Ajuste o caminho se precisar)
import { TelaListarMedicos } from "../../screens/Medico/TelaListarMedico";
// Importe o Placeholder para as telas que ainda não criamos
import { TelaPlaceholder } from "../../screens/Placeholder";

const Stack = createNativeStackNavigator<MedicosStackParamList>();

export function MedicosStack() {
    return (
        <Stack.Navigator
            screenOptions={{ header: (props) => <AppHeader {...props} /> }}
        >
            <Stack.Screen
                name={Routes.ListarMedicos}
                component={TelaListarMedicos}
                options={{ title: "Médicos" }} // Deixe false pois a sua TelaListarMedicos não precisa de um segundo Header
            />
            <Stack.Screen
                name={Routes.CadastroMedico}
                component={TelaPlaceholder} // Quando criar a TelaFormularioMedicos, troque aqui!
                options={{ title: "Cadastrar médico" }}
            />
            <Stack.Screen
                name={Routes.DetalheMedico}
                component={TelaPlaceholder} // Quando criar a TelaFormularioMedicos, troque aqui!
                options={{ title: "Detalhe" }}
            />
        </Stack.Navigator>
    );
}