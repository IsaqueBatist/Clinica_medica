import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Consulta } from "../../../types/models/consulta.type";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";

interface PropsPacienteConfirmadoItem {
  consulta: Consulta;
  aoIniciarAtendimento: (consulta: Consulta) => void;
}

function formatarHora(data: Date): string {
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function PacienteConfirmadoItem({
  consulta,
  aoIniciarAtendimento,
}: PropsPacienteConfirmadoItem) {
  const { tema } = useTema();

  return (
    <TouchableOpacity
      onPress={() => aoIniciarAtendimento(consulta)}
      accessibilityLabel={`Iniciar atendimento de ${consulta.cliente.nome}`}
      accessibilityRole="button"
      activeOpacity={0.85}
      style={{
        backgroundColor: tema.cores.fundo.superficie,
        borderRadius: tema.raios.lg,
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        overflow: "hidden",
      }}
    >
      {/* Faixa de acento laranja no topo */}
      <View
        style={{
          height: 3,
          backgroundColor: tema.cores.marca.secundario,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: tema.espacamento.md,
          gap: tema.espacamento.md,
        }}
      >
        {/* Avatar com inicial */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: tema.cores.fundo.suave,
            borderWidth: 2,
            borderColor: tema.cores.marca.secundario,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Texto
            variante="corpo"
            peso="negrito"
            style={{ color: tema.cores.marca.primario, fontSize: 18 }}
          >
            {consulta.cliente.nome.charAt(0).toUpperCase()}
          </Texto>
        </View>

        {/* Info do paciente */}
        <View style={{ flex: 1, gap: 2 }}>
          <Texto variante="corpo" peso="negrito" numberOfLines={1}>
            {consulta.cliente.nome}
          </Texto>
          <View style={{ flexDirection: "row", alignItems: "center", gap: tema.espacamento.xs }}>
            <Texto variante="legenda" style={{ color: tema.cores.marca.primario, fontWeight: "600" }}>
              {formatarHora(consulta.dataHora)}
            </Texto>
            <Texto variante="legenda" cor="texto.suave">·</Texto>
            <Texto variante="legenda" cor="texto.suave">
              {consulta.tipo}
            </Texto>
          </View>
          {consulta.observacao ? (
            <Texto variante="legenda" cor="texto.suave" numberOfLines={1}>
              {consulta.observacao}
            </Texto>
          ) : null}
        </View>

        {/* Seta indicadora */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: tema.cores.marca.primario,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Texto style={{ color: "#fff", fontSize: 16, lineHeight: 20 }}>›</Texto>
        </View>
      </View>
    </TouchableOpacity>
  );
}