import { useEffect } from "react";
import { ScrollView, View } from "react-native";

import { useContextoConsulta } from "../../../../hooks";
import { Texto } from "../../../../components/ui/Texto";
import { Badge } from "../../../../components/ui/Badge";
import { Card } from "../../../../components/ui/Card";
import { Divisor } from "../../../../components/ui/Divisor";
import { useTema } from "../../../../hooks/useTema";
import {
  TIPO_CONSULTA,
  TIPO_CONSULTA_LABEL,
} from "../../../../constants/consulta";
import { canCobrar } from "../../../../domain/consulta";
import { AcaoMarcacao, EstadoMarcacao } from "../../tiposMarcacao";

interface Props {
  state: EstadoMarcacao;
  dispatch: React.Dispatch<AcaoMarcacao>;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatarDataHora(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EtapaResumo({ state, dispatch }: Props) {
  const { tema } = useTema();
  const { state: consultasState } = useContextoConsulta();

  // Auto-detecta tipo (nova vs retorno) quando cliente+médico estão definidos.
  // Roda uma vez por combinação; o reducer limpa `tipo` se cliente trocar.
  useEffect(() => {
    if (!state.cliente || !state.medico || state.tipo) return;
    const jaTeve = consultasState.items.some(
      (c) =>
        c.cliente.identificacao === state.cliente!.identificacao &&
        c.medico.matricula === state.medico!.matricula,
    );
    dispatch({
      type: "SET_TIPO",
      payload: jaTeve ? TIPO_CONSULTA.RETORNO : TIPO_CONSULTA.NOVA,
    });
  }, [state.cliente, state.medico, state.tipo, consultasState.items, dispatch]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tema.espacamento.lg,
        gap: tema.espacamento.md,
      }}
    >
      <Texto variante="h3" peso="negrito">
        Resumo da consulta
      </Texto>
      <Texto variante="legenda" cor="texto.secundario">
        Confira os dados antes de confirmar.
      </Texto>

      <Card variante="elevado">
        <Linha rotulo="Cliente" valor={state.cliente?.nome} />
        <Divisor />
        <Linha rotulo="Médico" valor={state.medico?.nome} />
        <Divisor />
        <Linha rotulo="Especialidade" valor={state.especialidade?.nome} />
        <Divisor />
        <Linha
          rotulo="Data e hora"
          valor={state.dataHora && formatarDataHora(state.dataHora)}
        />
        <Divisor />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: tema.espacamento.sm,
          }}
        >
          <Texto variante="legenda" cor="texto.secundario">
            Tipo
          </Texto>
          {state.tipo ? (
            <Badge
              variante={state.tipo === TIPO_CONSULTA.RETORNO ? "info" : "marca"}
            >
              {TIPO_CONSULTA_LABEL[state.tipo]}
            </Badge>
          ) : (
            <Texto variante="legenda" cor="texto.suave">
              —
            </Texto>
          )}
        </View>
      </Card>

      {state.tipo && !canCobrar(state.tipo) && (
        <View
          style={{
            padding: tema.espacamento.md,
            borderRadius: tema.raios.md,
            backgroundColor: tema.cores.fundo.suave,
            borderLeftWidth: 3,
            borderLeftColor: tema.cores.status.info,
          }}
        >
          <Texto variante="legenda" peso="medio">
            Consulta de retorno — sem cobrança.
          </Texto>
        </View>
      )}
    </ScrollView>
  );
}

interface PropsLinha {
  rotulo: string;
  valor?: string;
}

function Linha({ rotulo, valor }: PropsLinha) {
  const { tema } = useTema();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: tema.espacamento.sm,
        gap: tema.espacamento.md,
      }}
    >
      <Texto variante="legenda" cor="texto.secundario">
        {rotulo}
      </Texto>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Texto
          variante="corpo"
          peso="medio"
          alinhamento="right"
          numberOfLines={2}
        >
          {valor ?? "—"}
        </Texto>
      </View>
    </View>
  );
}
