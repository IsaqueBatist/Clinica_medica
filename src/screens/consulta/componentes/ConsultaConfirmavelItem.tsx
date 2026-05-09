import React from "react";
import { View } from "react-native";

import type { Consulta } from "../../../types/models/consulta.type";
import { useTema } from "../../../hooks/useTema";
import { Botao } from "../../../components/ui/Botao";
import { Card } from "../../../components/ui/Card";
import { Texto } from "../../../components/ui/Texto";

function formatarHora(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface PropsConsultaConfirmavelItem {
  consulta: Consulta;
  aoConfirmar: () => void;
  carregandoConfirmar?: boolean;
}

export function ConsultaConfirmavelItem({
  consulta,
  aoConfirmar,
  carregandoConfirmar = false,
}: PropsConsultaConfirmavelItem) {
  const { tema } = useTema();

  return (
    <Card variante="simples" preenchimento="md">
      <View style={{ gap: tema.espacamento.sm }}>
        <Texto variante="h3" peso="negrito">
          {formatarHora(consulta.dataHora)}
        </Texto>
        <Texto variante="corpo" peso="medio">
          {consulta.cliente.nome}
        </Texto>
        <Texto variante="corpo" cor="texto.secundario">
          {consulta.medico.nome}
        </Texto>
        <Texto variante="legenda" cor="texto.suave">
          {consulta.medico.especialidade.nome}
        </Texto>
        <View style={{ marginTop: tema.espacamento.sm }}>
          <Botao
            rotulo="Confirmar presença"
            variante="primario"
            larguraTotal
            carregando={carregandoConfirmar}
            onPress={aoConfirmar}
          />
        </View>
      </View>
    </Card>
  );
}
