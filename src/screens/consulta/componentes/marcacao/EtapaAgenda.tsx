import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useContextoConsulta } from "../../../../hooks";
import { Texto } from "../../../../components/ui/Texto";
import { useTema } from "../../../../hooks/useTema";
import {
  STATUS_AGENDA,
  STATUS_AGENDA_LABEL,
  type StatusAgenda,
} from "../../../../constants/agenda";
import { STATUS_CONSULTA } from "../../../../constants/consulta";
import { STATUS_AGENDA_ROLE } from "../../../../theme/statusColor";
import type { Consulta } from "../../../../types/models/consulta.type";
import type { DiasAtendimento } from "../../../../types/models/diasAtendimento.type";
import type { Medico } from "../../../../types/models/medico.type";
import type { PaletaCores } from "../../../../types/paletaCores.type";
import { AcaoMarcacao, EstadoMarcacao } from "../../tiposMarcacao";

interface Props {
  state: EstadoMarcacao;
  dispatch: React.Dispatch<AcaoMarcacao>;
}

const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const NOMES_DIA_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const SELECIONAVEIS: readonly StatusAgenda[] = [
  STATUS_AGENDA.LIVRE,
  STATUS_AGENDA.CANCELADO_PELO_CLIENTE,
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatarHora(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function inicioDoDia(d: Date): Date {
  const novo = new Date(d);
  novo.setHours(0, 0, 0, 0);
  return novo;
}

function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Mapeia consulta existente em status visual da agenda. Se não há consulta no
// slot, é L (Livre).
function statusDoSlotConsulta(consulta: Consulta | undefined): StatusAgenda {
  if (!consulta) return STATUS_AGENDA.LIVRE;
  switch (consulta.situacao) {
    case STATUS_CONSULTA.MARCADA:
    case STATUS_CONSULTA.CONFIRMADA:
    case STATUS_CONSULTA.REALIZADA:
    case STATUS_CONSULTA.ENCERRADA:
      return STATUS_AGENDA.MARCADO;
    case STATUS_CONSULTA.CANCELADA_PELO_CLIENTE:
    case STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO:
      return STATUS_AGENDA.CANCELADO_PELO_CLIENTE;
    case STATUS_CONSULTA.CANCELADA_PELO_MEDICO:
      return STATUS_AGENDA.CANCELADO_PELO_MEDICO;
    default:
      return STATUS_AGENDA.LIVRE;
  }
}

function gerarSlotsDoDia(
  dia: Date,
  atends: DiasAtendimento[],
  agora: Date,
): Date[] {
  const slots: Date[] = [];
  for (const atend of atends) {
    const [hi, mi] = atend.horaInicio.split(":").map(Number);
    const [hf, mf] = atend.horaFim.split(":").map(Number);
    const inicio = new Date(dia);
    inicio.setHours(hi, mi, 0, 0);
    const fim = new Date(dia);
    fim.setHours(hf, mf, 0, 0);
    const passoMs = atend.tempoEstimado * 60_000;
    for (let t = inicio.getTime(); t < fim.getTime(); t += passoMs) {
      if (t > agora.getTime()) slots.push(new Date(t));
    }
  }
  return slots.sort((a, b) => a.getTime() - b.getTime());
}

interface SlotComStatus {
  dataHora: Date;
  status: StatusAgenda;
}

function montarSlotsDoDia(
  dia: Date,
  medico: Medico,
  consultas: Consulta[],
  agora: Date,
): SlotComStatus[] {
  const dias = medico.diasAtendimento ?? [];
  const atendsDoDia = dias.filter((d) => d.diaSemana === dia.getDay());
  if (atendsDoDia.length === 0) return [];

  const consultasDoMedico = consultas.filter(
    (c) => c.medico.matricula === medico.matricula,
  );

  return gerarSlotsDoDia(dia, atendsDoDia, agora).map((dataHora) => {
    const consulta = consultasDoMedico.find(
      (c) =>
        mesmoDia(c.dataHora, dataHora) &&
        c.dataHora.getHours() === dataHora.getHours() &&
        c.dataHora.getMinutes() === dataHora.getMinutes(),
    );
    return { dataHora, status: statusDoSlotConsulta(consulta) };
  });
}

type SituacaoDia = "passado" | "sem_atendimento" | "lotado" | "disponivel";

function situacaoDoDia(
  dia: Date,
  medico: Medico,
  consultas: Consulta[],
  agora: Date,
): SituacaoDia {
  if (inicioDoDia(dia).getTime() < inicioDoDia(agora).getTime()) {
    return "passado";
  }
  const slots = montarSlotsDoDia(dia, medico, consultas, agora);
  if (slots.length === 0) return "sem_atendimento";
  const algumLivre = slots.some((s) => SELECIONAVEIS.includes(s.status));
  return algumLivre ? "disponivel" : "lotado";
}

function corStatus(status: StatusAgenda, cores: PaletaCores) {
  return cores.status[STATUS_AGENDA_ROLE[status]];
}

export function EtapaAgenda({ state, dispatch }: Props) {
  const { tema } = useTema();
  const { state: consultasState } = useContextoConsulta();

  const medico = state.medico;
  const agora = useMemo(() => new Date(), []);

  const [mesVisivel, setMesVisivel] = useState(
    () => new Date(agora.getFullYear(), agora.getMonth(), 1),
  );
  const [diaSelecionado, setDiaSelecionado] = useState<Date | undefined>(
    state.dataHora ? inicioDoDia(state.dataHora) : undefined,
  );

  const slotsDoDia = useMemo(() => {
    if (!medico || !diaSelecionado) return [];
    return montarSlotsDoDia(
      diaSelecionado,
      medico,
      consultasState.items,
      agora,
    );
  }, [medico, diaSelecionado, consultasState.items, agora]);

  if (!medico) {
    return (
      <View style={{ flex: 1, padding: tema.espacamento.lg }}>
        <Texto cor="texto.secundario">Selecione um médico antes.</Texto>
      </View>
    );
  }

  function irMes(delta: number) {
    setMesVisivel((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tema.espacamento.lg,
        gap: tema.espacamento.lg,
      }}
    >
      <View>
        <Texto variante="h3" peso="negrito">
          Escolha um horário
        </Texto>
        <Texto variante="legenda" cor="texto.secundario">
          {medico.nome}
        </Texto>
      </View>

      <Calendario
        mesVisivel={mesVisivel}
        medico={medico}
        consultas={consultasState.items}
        agora={agora}
        diaSelecionado={diaSelecionado}
        aoSelecionarDia={setDiaSelecionado}
        aoIrMes={irMes}
      />

      <Legenda />

      {diaSelecionado ? (
        <ListaSlots
          dia={diaSelecionado}
          slots={slotsDoDia}
          slotSelecionado={state.dataHora}
          aoSelecionar={(d) => dispatch({ type: "SET_SLOT", payload: d })}
        />
      ) : (
        <Texto cor="texto.secundario" alinhamento="center">
          Toque em um dia disponível para ver os horários.
        </Texto>
      )}
    </ScrollView>
  );
}

// --- Calendário -------------------------------------------------------------

interface PropsCalendario {
  mesVisivel: Date;
  medico: Medico;
  consultas: Consulta[];
  agora: Date;
  diaSelecionado?: Date;
  aoSelecionarDia: (d: Date) => void;
  aoIrMes: (delta: number) => void;
}

function Calendario({
  mesVisivel,
  medico,
  consultas,
  agora,
  diaSelecionado,
  aoSelecionarDia,
  aoIrMes,
}: PropsCalendario) {
  const { tema } = useTema();

  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const offsetInicial = new Date(ano, mes, 1).getDay();

  // Células: vazias antes do dia 1 + dias do mês.
  const celulas: (Date | null)[] = [
    ...Array.from({ length: offsetInicial }, () => null),
    ...Array.from({ length: ultimoDia }, (_, i) => new Date(ano, mes, i + 1)),
  ];

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        borderRadius: tema.raios.lg,
        padding: tema.espacamento.md,
        gap: tema.espacamento.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SetaMes direcao="anterior" onPress={() => aoIrMes(-1)} />
        <Texto variante="corpo" peso="negrito">
          {NOMES_MES[mes]} {ano}
        </Texto>
        <SetaMes direcao="proximo" onPress={() => aoIrMes(1)} />
      </View>

      <View style={{ flexDirection: "row" }}>
        {NOMES_DIA_SEMANA.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Texto variante="legenda" cor="texto.suave" peso="medio">
              {d}
            </Texto>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {celulas.map((dia, idx) => (
          <View key={idx} style={{ width: `${100 / 7}%`, padding: 2 }}>
            {dia ? (
              <CelulaDia
                dia={dia}
                situacao={situacaoDoDia(dia, medico, consultas, agora)}
                selecionado={!!diaSelecionado && mesmoDia(dia, diaSelecionado)}
                aoSelecionar={aoSelecionarDia}
              />
            ) : (
              <View style={{ height: 36 }} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

interface PropsSetaMes {
  direcao: "anterior" | "proximo";
  onPress: () => void;
}

function SetaMes({ direcao, onPress }: PropsSetaMes) {
  const { tema } = useTema();
  const rotulo = direcao === "anterior" ? "‹" : "›";
  const acessivel = direcao === "anterior" ? "Mês anterior" : "Próximo mês";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={acessivel}
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: tema.raios.md,
        backgroundColor: tema.cores.fundo.suave,
      }}
    >
      <Texto variante="corpo" peso="negrito">
        {rotulo}
      </Texto>
    </Pressable>
  );
}

interface PropsCelulaDia {
  dia: Date;
  situacao: SituacaoDia;
  selecionado: boolean;
  aoSelecionar: (d: Date) => void;
}

function CelulaDia({
  dia,
  situacao,
  selecionado,
  aoSelecionar,
}: PropsCelulaDia) {
  const { tema } = useTema();
  const desabilitado = situacao !== "disponivel";

  const fundo = selecionado
    ? tema.cores.marca.primario
    : situacao === "disponivel"
      ? tema.cores.fundo.suave
      : "transparent";

  const corTexto = selecionado
    ? "texto.sobreMarca"
    : desabilitado
      ? "texto.suave"
      : "texto.primario";

  return (
    <Pressable
      disabled={desabilitado}
      onPress={() => aoSelecionar(dia)}
      style={{
        height: 36,
        borderRadius: tema.raios.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: fundo,
        opacity: desabilitado && !selecionado ? 0.5 : 1,
      }}
    >
      <Texto
        variante="legenda"
        peso={selecionado ? "negrito" : "regular"}
        cor={corTexto}
      >
        {dia.getDate()}
      </Texto>
    </Pressable>
  );
}

// --- Lista de slots ---------------------------------------------------------

interface PropsListaSlots {
  dia: Date;
  slots: SlotComStatus[];
  slotSelecionado?: Date;
  aoSelecionar: (d: Date) => void;
}

function ListaSlots({
  dia,
  slots,
  slotSelecionado,
  aoSelecionar,
}: PropsListaSlots) {
  const { tema } = useTema();

  if (slots.length === 0) {
    return (
      <View>
        <TituloDia dia={dia} />
        <Texto
          cor="texto.secundario"
          style={{ marginTop: tema.espacamento.sm }}
        >
          Médico não atende neste dia.
        </Texto>
      </View>
    );
  }

  return (
    <View style={{ gap: tema.espacamento.sm }}>
      <TituloDia dia={dia} />
      {slots.map((slot) => (
        <CelulaSlot
          key={slot.dataHora.getTime()}
          slot={slot}
          selecionado={
            !!slotSelecionado &&
            slotSelecionado.getTime() === slot.dataHora.getTime()
          }
          aoSelecionar={aoSelecionar}
        />
      ))}
    </View>
  );
}

function TituloDia({ dia }: { dia: Date }) {
  return (
    <Texto variante="corpo" peso="negrito">
      Agenda: {NOMES_DIA_SEMANA_LONGOS[dia.getDay()]}, {dia.getDate()} de{" "}
      {NOMES_MES[dia.getMonth()]} de {dia.getFullYear()}
    </Texto>
  );
}

const NOMES_DIA_SEMANA_LONGOS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface PropsCelulaSlot {
  slot: SlotComStatus;
  selecionado: boolean;
  aoSelecionar: (d: Date) => void;
}

function CelulaSlot({ slot, selecionado, aoSelecionar }: PropsCelulaSlot) {
  const { tema } = useTema();
  const selecionavel = SELECIONAVEIS.includes(slot.status);
  const cor = corStatus(slot.status, tema.cores);

  return (
    <Pressable
      disabled={!selecionavel}
      onPress={() => aoSelecionar(slot.dataHora)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: tema.espacamento.md,
        paddingVertical: tema.espacamento.xs,
      }}
    >
      <View style={{ width: 56 }}>
        <Texto variante="legenda" peso="medio" cor="texto.secundario">
          {formatarHora(slot.dataHora)}
        </Texto>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: cor,
          borderRadius: tema.raios.md,
          paddingVertical: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          borderWidth: selecionado ? 2 : 0,
          borderColor: tema.cores.borda.foco,
          opacity: selecionavel ? 1 : 0.55,
          alignItems: "center",
        }}
      >
        <Texto variante="legenda" peso="negrito" style={{ color: "#fff" }}>
          {slot.status}
        </Texto>
      </View>
    </Pressable>
  );
}

// --- Legenda ----------------------------------------------------------------

function Legenda() {
  const { tema } = useTema();
  const itens = Object.values(STATUS_AGENDA);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        borderRadius: tema.raios.md,
        padding: tema.espacamento.md,
        gap: tema.espacamento.xs,
      }}
    >
      <Texto variante="legenda" peso="medio" cor="texto.secundario">
        Legenda
      </Texto>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: tema.espacamento.md,
        }}
      >
        {itens.map((s) => (
          <View
            key={s}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.xs,
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: corStatus(s, tema.cores),
              }}
            />
            <Texto variante="legenda" cor="texto.secundario">
              {s} – {STATUS_AGENDA_LABEL[s]}
            </Texto>
          </View>
        ))}
      </View>
    </View>
  );
}
