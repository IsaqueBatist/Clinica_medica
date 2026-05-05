import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { ChaveEspacamento } from "../../../theme/spacing";

/**
 * Card — superfície genérica para agrupar conteúdo. Sem opinar sobre layout
 * interno (use flexDirection nas props se precisar). `variante` controla apenas
 * o "peso" visual: `simples` = só borda, `elevado` = adiciona sombra sutil.
 */

export type VarianteCard = "simples" | "elevado" | "destaque";

export interface PropsCard extends ViewProps {
  variante?: VarianteCard;
  preenchimento?: ChaveEspacamento;
}

export function Card({
  variante = "simples",
  preenchimento = "lg",
  style,
  children,
  ...rest
}: PropsCard) {
  const { tema } = useTema();
  const { cores, espacamento, raios } = tema;

  const base: ViewStyle = {
    backgroundColor: cores.fundo.superficie,
    borderRadius: raios.lg,
    padding: espacamento[preenchimento],
    borderWidth: 1,
    borderColor: cores.borda.padrao,
  };

  const elevado: ViewStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  };

  const destaque: ViewStyle = {
    borderColor: cores.marca.secundario,
    borderWidth: 1.5,
  };

  return (
    <View
      {...rest}
      style={[
        base,
        variante === "elevado" && elevado,
        variante === "destaque" && destaque,
        style,
      ]}
    >
      {children}
    </View>
  );
}
