import React from "react";
import { View, type ViewStyle } from "react-native";

import { useTema } from "../../../hooks/useTema";

export interface PropsDivisor {
  orientacao?: "horizontal" | "vertical";
  forte?: boolean;
  margem?: number;
}

export function Divisor({
  orientacao = "horizontal",
  forte = false,
  margem,
}: PropsDivisor) {
  const { tema } = useTema();
  const cor = forte ? tema.cores.borda.forte : tema.cores.borda.padrao;

  const estilo: ViewStyle =
    orientacao === "horizontal"
      ? {
          height: 1,
          backgroundColor: cor,
          width: "100%",
          marginVertical: margem ?? tema.espacamento.md,
        }
      : {
          width: 1,
          backgroundColor: cor,
          alignSelf: "stretch",
          marginHorizontal: margem ?? tema.espacamento.md,
        };

  return <View style={estilo} />;
}
