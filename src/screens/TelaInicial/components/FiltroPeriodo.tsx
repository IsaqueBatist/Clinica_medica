import React, { memo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";
import { Periodo } from "../../../types/stats";

interface PropsPeriodoFilter {
  periodoAtivo: Periodo;
  aoMudar: (p: Periodo) => void;
}

const PERIODOS: { chave: Periodo; rotulo: string }[] = [
  { chave: "hoje", rotulo: "Hoje" },
  { chave: "semana", rotulo: "Semana" },
  { chave: "mes", rotulo: "Mês" },
];

export const PeriodoFilter = memo(({ periodoAtivo, aoMudar }: PropsPeriodoFilter) => {
  const { tema } = useTema();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        backgroundColor: tema.cores.fundo.suave,
        borderRadius: tema.raios.lg,
        padding: 4,
        alignSelf: "flex-start",
      }}
      accessibilityRole="tablist"
    >
      {PERIODOS.map(({ chave, rotulo }) => {
        const ativo = periodoAtivo === chave;
        return (
          <TouchableOpacity
            key={chave}
            onPress={() => aoMudar(chave)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Filtrar por ${rotulo}`}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: tema.raios.md,
              backgroundColor: ativo ? tema.cores.marca.primario : "transparent",
            }}
          >
            <Texto
              variante="legenda"
              style={{
                fontSize: 13,
                fontWeight: ativo ? "600" : "400",
                color: ativo ? "#ffffff" : tema.cores.texto.secundario,
              }}
            >
              {rotulo}
            </Texto>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});