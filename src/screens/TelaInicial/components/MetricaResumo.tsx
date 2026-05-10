import React from "react";
import { View } from "react-native";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";
import { Feather } from "@expo/vector-icons";

interface PropsMetricaResumo {
  titulo: string;
  valor: string;
  subtitulo?: string;
  icone: keyof typeof Feather.glyphMap;
  corIcone: string;
  /** Adiciona borda esquerda laranja — use na métrica principal */
  destaque?: boolean;
  /** Sobrescreve a cor do valor (ex: vermelho para no-show alto) */
  corValor?: string;
}

export function MetricaResumo({
  titulo,
  valor,
  subtitulo,
  icone,
  corIcone,
  destaque,
  corValor,
}: PropsMetricaResumo) {
  const { tema } = useTema();

  return (
    <View
      style={{
        flex: 1,
        padding: 14,
        backgroundColor: tema.cores.fundo.superficie,
        borderRadius: tema.raios.lg,
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        // Destaque: substitui borda esquerda padrão por laranja (3px)
        borderLeftWidth: destaque ? 3 : 1,
        borderLeftColor: destaque ? tema.cores.marca.primario : tema.cores.borda.padrao,
        gap: 10,
      }}
    >
      {/* Rótulo + ícone na mesma linha */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Feather name={icone} size={14} color={corIcone} />
        <Texto
          variante="legenda"
          style={{
            fontSize: 11,
            color: tema.cores.texto.suave,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            flex: 1,
          }}
        >
          {titulo}
        </Texto>
      </View>

      {/* Valor */}
      <View style={{ gap: 2 }}>
        <Texto
          variante="h1"
          style={{
            fontSize: 22,
            fontWeight: "500",
            lineHeight: 26,
            color: corValor ?? tema.cores.texto.primario,
          }}
        >
          {valor}
        </Texto>
        {subtitulo ? (
          <Texto
            variante="legenda"
            style={{ fontSize: 11, color: tema.cores.texto.suave }}
          >
            {subtitulo}
          </Texto>
        ) : null}
      </View>
    </View>
  );
}