import React from "react";
import { useNavigation } from "@react-navigation/native";
import { BarraInferior, type ItemBarra } from "./navegacao/BarraInferior";
import { Routes } from "../constants/routes";

const ITENS: ItemBarra[] = [
  { chave: Routes.DashboardStack, icone: "casa", rotuloAcessivel: "Dashboard" },
  { chave: Routes.ClientesStack, icone: "usuario", rotuloAcessivel: "Clientes" },
  { chave: Routes.ConsultasStack, icone: "calendario", rotuloAcessivel: "Consultas" },
];

interface PropsGlobalBarraInferior {
  rotaAtiva: string;
}

/**
 * GlobalBarraInferior
 *
 * Não lê mais o estado de navegação diretamente via useNavigationState.
 * Esse hook exige estar dentro de um navigator já inicializado — o que
 * causava o erro na web onde a ordem de montagem não é garantida.
 *
 * A rota ativa agora vem como prop do LayoutAutenticado, que a obtém
 * via callback onStateChange do NavigationContainer — garantindo que
 * o estado já existe quando este componente renderiza.
 */
export function GlobalBarraInferior({ rotaAtiva }: PropsGlobalBarraInferior) {
  const navigation = useNavigation<any>();

  const aoSelecionar = (chave: string) => {
    try {
      navigation.navigate(chave);
    } catch (e) {
      console.warn("Falha na navegação global:", e);
    }
  };

  return (
    <BarraInferior
      itens={ITENS}
      chaveAtiva={rotaAtiva}
      aoSelecionar={aoSelecionar}
    />
  );
}