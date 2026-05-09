import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { Texto } from "../../ui/Texto";

export interface PropsEmptyState {
  titulo: string;
  descricao?: string;
  nomeIcone?: NomeIcone;
}

/**
 * Lista ou seção sem itens — tom neutro-informativo (não é erro).
 */
export function EmptyState({
  titulo,
  descricao,
  nomeIcone = "calendario",
}: PropsEmptyState) {
  const { tema } = useTema();

  return (
    <View
      accessibilityRole="text"
      style={{
        alignItems: "center",
        gap: tema.espacamento.md,
        padding: tema.espacamento.xl,
      }}
    >
      <Icone
        nome={nomeIcone}
        tamanho={40}
        cor="texto.suave"
      />
      <Texto variante="h3" peso="negrito" alinhamento="center">
        {titulo}
      </Texto>
      {descricao ? (
        <Texto variante="corpo" cor="texto.secundario" alinhamento="center">
          {descricao}
        </Texto>
      ) : null}
    </View>
  );
}
