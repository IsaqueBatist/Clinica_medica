import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Spinner } from "../../ui/Spinner";
import { Texto } from "../../ui/Texto";

/**
 * EstadoCarregando — placeholder fullscreen ou inline para operações
 * assíncronas. Padrão é spinner + texto "Carregando..." (centrado), mas o
 * `mensagem` aceita customizar (ex: "Buscando cliente...").
 */

export interface PropsEstadoCarregando {
  mensagem?: string;
  /** `tela` ocupa toda a área disponível; `inline` cabe em qualquer container. */
  variante?: "tela" | "inline";
}

export function EstadoCarregando({
  mensagem = "Carregando...",
  variante = "tela",
}: PropsEstadoCarregando) {
  const { tema } = useTema();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={mensagem}
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: tema.espacamento.lg,
        ...(variante === "tela" && {
          flex: 1,
          padding: tema.espacamento.xl,
        }),
        ...(variante === "inline" && {
          paddingVertical: tema.espacamento.xl,
        }),
      }}
    >
      <Spinner tamanho={36} />
      <Texto variante="corpo" peso="medio" cor="texto.secundario">
        {mensagem}
      </Texto>
    </View>
  );
}
