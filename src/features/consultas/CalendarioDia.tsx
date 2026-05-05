import React, { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useTema } from "../../hooks/useTema";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Texto } from "../../components/ui/Texto";
import { BadgeConsulta } from "./BadgeConsulta";
import { type SituacaoConsulta } from "../../constants/consulta";

/**
 * CalendarioDia — visão diária com slots de horário e listagem das consultas
 * agendadas no dia. Estrutura propositalmente "burra": recebe consultas
 * pré-filtradas via prop e renderiza. Filtros, navegação entre dias e
 * integração com serviço ficam fora — vivem no screen ou hook que orquestra.
 *
 * Layout do card de consulta (revisado para mobile):
 *  - Linha 1 (row, baseline): nome do paciente | badge de status — paciente
 *    com `numberOfLines={1}` e ellipsize, badge com `flexShrink: 0` pra
 *    nunca quebrar.
 *  - Linha 2: avatar + médico/duração, alinhados em row.
 * Stack vertical se o conteúdo precisar caber em <300px sem que cada caractere
 * vá pra uma linha (bug conhecido do flex+row quando há concorrência apertada
 * entre filhos).
 *
 * Granularidade: 30 min por padrão (alinha com `tempoEstimado` da maioria
 * dos médicos do mock). Configurável via `granularidadeMinutos`.
 */

export interface ConsultaCalendario {
  id: string;
  dataHora: Date;
  duracaoMinutos: number;
  nomePaciente: string;
  nomeMedico: string;
  status: SituacaoConsulta;
}

export interface PropsCalendarioDia {
  data: Date;
  consultas: ConsultaCalendario[];
  horaInicio?: number;
  horaFim?: number;
  granularidadeMinutos?: number;
  aoSelecionarConsulta?: (id: string) => void;
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function mesmaData(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function formatarHora(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CalendarioDia({
  data,
  consultas,
  horaInicio = 7,
  horaFim = 19,
  granularidadeMinutos = 30,
  aoSelecionarConsulta,
}: PropsCalendarioDia) {
  const { tema } = useTema();
  const ehHoje = mesmaData(data, new Date());

  // Pré-computa um índice horário→consulta para casamento O(1) ao montar slots.
  const indice = useMemo(() => {
    const m = new Map<string, ConsultaCalendario>();
    for (const c of consultas) m.set(formatarHora(c.dataHora), c);
    return m;
  }, [consultas]);

  const slots = useMemo(() => {
    const lista: { hora: string; ts: number }[] = [];
    const inicio = new Date(data);
    inicio.setHours(horaInicio, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(horaFim, 0, 0, 0);
    for (
      let cursor = inicio.getTime();
      cursor < fim.getTime();
      cursor += granularidadeMinutos * 60_000
    ) {
      const d = new Date(cursor);
      lista.push({ hora: formatarHora(d), ts: cursor });
    }
    return lista;
  }, [data, horaInicio, horaFim, granularidadeMinutos]);

  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.md,
          paddingHorizontal: tema.espacamento.lg,
          paddingVertical: tema.espacamento.lg,
          borderBottomWidth: 1,
          borderBottomColor: tema.cores.borda.padrao,
        }}
      >
        <View style={{ flex: 1 }}>
          <Texto variante="h2" peso="negrito">
            {data.getDate()} de {MESES[data.getMonth()]}
          </Texto>
          <Texto variante="corpo" cor="texto.secundario">
            {DIAS_SEMANA[data.getDay()]}
          </Texto>
        </View>
        {ehHoje && <Badge variante="info">Hoje</Badge>}
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: tema.espacamento.lg,
          gap: tema.espacamento.sm,
        }}
      >
        {slots.map((slot) => {
          const consulta = indice.get(slot.hora);
          return (
            <View
              key={slot.ts}
              style={{
                flexDirection: "row",
                alignItems: consulta ? "flex-start" : "center",
                gap: tema.espacamento.md,
              }}
            >
              <View style={{ width: 48 }}>
                <Texto
                  variante="legenda"
                  peso="medio"
                  cor={consulta ? "texto.primario" : "texto.suave"}
                >
                  {slot.hora}
                </Texto>
              </View>

              {consulta ? (
                <View style={{ flex: 1, minWidth: 0 }}>
                  <CardConsulta
                    consulta={consulta}
                    aoSelecionar={aoSelecionarConsulta}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: tema.cores.borda.padrao,
                    opacity: 0.5,
                  }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface PropsCardConsulta {
  consulta: ConsultaCalendario;
  aoSelecionar?: (id: string) => void;
}

function CardConsulta({ consulta, aoSelecionar }: PropsCardConsulta) {
  const { tema } = useTema();

  const conteudo = (
    <Card variante="elevado" preenchimento="md">
      {/* Linha 1: nome + badge. minWidth:0 no nome força o ellipsize a respeitar
          o flex em vez de empurrar a badge ou quebrar caractere por caractere. */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Texto
            variante="corpo"
            peso="medio"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {consulta.nomePaciente}
          </Texto>
        </View>
        <View style={{ flexShrink: 0 }}>
          <BadgeConsulta status={consulta.status} />
        </View>
      </View>

      {/* Linha 2: avatar + médico/duração. */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          marginTop: tema.espacamento.xs,
        }}
      >
        <Avatar nome={consulta.nomePaciente} tamanho="sm" />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Texto
            variante="legenda"
            cor="texto.secundario"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            com {consulta.nomeMedico} · {consulta.duracaoMinutos} min
          </Texto>
        </View>
      </View>
    </Card>
  );

  if (!aoSelecionar) return conteudo;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Consulta de ${consulta.nomePaciente}`}
      onPress={() => aoSelecionar(consulta.id)}
    >
      {conteudo}
    </Pressable>
  );
}
