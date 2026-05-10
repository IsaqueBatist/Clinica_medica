import React from "react";
import { View } from "react-native";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";

export function SaudacaoHeader() {
  const { tema } = useTema();
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={{ paddingVertical: tema.espacamento.md, gap: 2 }}>
      {/* Data em cima — hierarquia invertida: contexto antes do título */}
      <Texto
        variante="legenda"
        style={{
          fontSize: 12,
          color: tema.cores.texto.suave,
          textTransform: "capitalize",
          letterSpacing: 0.3,
        }}
      >
        {hoje}
      </Texto>
      <View style={{ flexDirection: "row", alignItems: "center", gap: tema.espacamento.sm }}>
        {/* Barra de acento laranja */}
        <View
          style={{
            width: 3,
            height: 28,
            borderRadius: 2,
            backgroundColor: tema.cores.marca.secundario,
          }}
        />
        <Texto variante="h1">Olá, Recepção</Texto>
      </View>
    </View>
  );
}