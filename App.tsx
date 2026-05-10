import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ProvedorTema } from "./src/theme";
import { ProvedorToast } from "./src/contexts/ContextoToast";
import { AppNavigator } from "./src/navigation";
import { ProvedoresApp } from "./src/contexts";

/**
 * Entrada do app.
 *
 * Hierarquia de providers (ordem importa):
 *   SafeAreaProvider  → respeita notches/cantos arredondados
 *     ProvedorTema    → tokens de cor/espaçamento (claro|escuro)
 *       ProvedorToast → consome o tema, então fica abaixo
 *         <App>
 *
 * Auth e navegação são desacoplados: enquanto não autenticado, mostramos
 * `TelaLogin` direto (sem NavigationContainer). Após login, o `AppNavigator`
 * monta o `NavigationContainer` + Drawer. Vantagem: o usuário não autenticado
 * nunca tem state de navegação alocado, e a transição login → app é uma
 * remontagem limpa.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ProvedorTema modoInicial="claro">
        <ProvedorToast>
          <ProvedoresApp>
            <AppNavigator />
            <StatusBar style="auto" />
          </ProvedoresApp>
        </ProvedorToast>
      </ProvedorTema>
    </SafeAreaProvider>
  );
}
