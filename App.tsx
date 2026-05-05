import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ProvedorTema } from "./src/theme";
import { ProvedorToast } from "./src/contexts/ContextoToast";
import { TelaLogin } from "./src/screens/Login";
import { AppNavigator } from "./src/navigation";

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
  const [autenticado, setAutenticado] = useState(false);

  return (
    <SafeAreaProvider>
      <ProvedorTema modoInicial="claro">
        <ProvedorToast>
          <StatusBar style="auto" />
          {autenticado ? (
            <AppNavigator aoSair={() => setAutenticado(false)} />
          ) : (
            <TelaLogin aoEntrar={() => setAutenticado(true)} />
          )}
        </ProvedorToast>
      </ProvedorTema>
    </SafeAreaProvider>
  );
}
