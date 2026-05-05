import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

import { useTema } from "../../../hooks/useTema";

/**
 * Spinner — anel animado em rotação contínua. Implementado com Animated/View
 * (sem dependências) — um quarto-círculo que gira é o suficiente para sinalizar
 * loading sem o look genérico do `ActivityIndicator` do RN.
 */

export interface PropsSpinner {
  tamanho?: number;
  cor?: string;
  espessura?: number;
}

export function Spinner({ tamanho = 24, cor, espessura }: PropsSpinner) {
  const { tema } = useTema();
  const corResolvida = cor ?? tema.cores.marca.secundario;
  const traco = espessura ?? Math.max(2, Math.round(tamanho / 10));
  const rotacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotacao]);

  const giro = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel="Carregando"
      style={{
        width: tamanho,
        height: tamanho,
        transform: [{ rotate: giro }],
      }}
    >
      <View
        style={{
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          borderWidth: traco,
          borderColor: tema.cores.borda.padrao,
          borderTopColor: corResolvida,
        }}
      />
    </Animated.View>
  );
}
