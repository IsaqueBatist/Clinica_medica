import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ProvedorTema } from "./src/theme";
import { ProvedorToast } from "./src/contexts/ContextoToast";
import { TelaLogin } from "./src/screens/Login";
import { TelaShowcase } from "./src/screens/Showcase";

/**
 * Entrada do app.
 *
 * Hierarquia de providers (ordem importa):
 *   SafeAreaProvider  → respeita notches/cantos arredondados
 *     ProvedorTema    → tokens de cor/espaçamento (claro|escuro)
 *       ProvedorToast → consome o tema, então fica abaixo
 *         <App>
 *
 * Sem react-navigation por enquanto — alternamos manualmente entre Login e
 * Showcase via state. Quando o app for ganhar rotas reais, basta substituir
 * este switch por um `NavigationContainer + Stack.Navigator`.
 */
export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <SafeAreaProvider>
      <ProvedorTema modoInicial="claro">
        <ProvedorToast>
          <StatusBar style="auto" />
          {autenticado ? (
            <TelaShowcase aoSair={() => setAutenticado(false)} />
          ) : (
            <TelaLogin aoEntrar={() => setAutenticado(true)} />
          )}
        </ProvedorToast>
      </ProvedorTema>
    </SafeAreaProvider>
  );
}
