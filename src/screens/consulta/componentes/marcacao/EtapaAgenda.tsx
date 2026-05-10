import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import {
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  setHours,
  setMinutes,
  isBefore,
  startOfDay,
} from "date-fns";

import { useContextoConsulta } from "../../../../hooks";
import { Texto } from "../../../../components/ui/Texto";
import { useTema } from "../../../../hooks/useTema";
import {
  STATUS_AGENDA,
  STATUS_AGENDA_LABEL,
  StatusAgenda,
} from "../../../../constants/agenda";
import { STATUS_AGENDA_ROLE } from "../../../../theme/statusColor";
import { AcaoMarcacao, EstadoMarcacao } from "../../tiposMarcacao";

// Reaproveitamos a função pura e os tipos que criamos!
import { gerarSlots } from "../../../../utils/agenda";
import type { Medico } from "../../../../types/models/medico.type";
import type { PaletaCores } from "../../../../types/paletaCores.type";
import { SlotItem } from "../../../../components/agenda/SlotItem";
import { Slot } from "../../../../types/models/agenda";

interface Props {
  state: EstadoMarcacao;
  dispatch: React.Dispatch<AcaoMarcacao>;
}

const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const NOMES_DIA_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES_DIA_SEMANA_LONGOS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const SELECIONAVEIS: readonly StatusAgenda[] = [
  STATUS_AGENDA.LIVRE,
  STATUS_AGENDA.CANCELADO_PELO_CLIENTE,
];

type SituacaoDia = "passado" | "sem_atendimento" | "lotado" | "disponivel";

export function EtapaAgenda({ state, dispatch }: Props) {
  const { tema } = useTema();
  const { state: consultasState } = useContextoConsulta();
  const medico = state.medico;

  const agora = useMemo(() => new Date(), []);

  // Controla o mês que aparece no calendário
  const [mesVisivel, setMesVisivel] = useState(
    () => new Date(agora.getFullYear(), agora.getMonth(), 1),
  );

  // Controla qual dia foi clicado
  const [diaSelecionado, setDiaSelecionado] = useState<Date | undefined>(
    state.dataHora ? startOfDay(state.dataHora) : undefined,
  );

  // Reconstroi o estado do slot selecionado para a UI
  const slotSelecionadoAtual = useMemo<Slot | null>(() => {
    if (!state.dataHora) return null;
    return {
      data: format(state.dataHora, "yyyy-MM-dd"),
      horario: format(state.dataHora, "HH:mm"),
      status: STATUS_AGENDA.LIVRE, // Irrelevante para comparação visual
    };
  }, [state.dataHora]);

  // =======================================================================
  // MOTOR DE DADOS: Calcula os slots de todo o mês visível de forma O(1)
  // =======================================================================
  const slotsDoMesVisivel = useMemo(() => {
    if (!medico) return [];
    const inicio = startOfMonth(mesVisivel);
    const fim = endOfMonth(mesVisivel);

    // Chama a nossa função pura que está no utils/agenda.ts
    return gerarSlots(medico, inicio, fim, consultasState.items, agora);
  }, [medico, mesVisivel, consultasState.items, agora]);

  // Agrupa os slots por dia para facilitar o Calendário e a Lista
  const { mapaStatusDias, slotsPorDia } = useMemo(() => {
    const statusMap = new Map<string, SituacaoDia>();
    const slotsMap = new Map<string, Slot[]>();

    for (const slot of slotsDoMesVisivel) {
      // Agrupa os slots do dia
      if (!slotsMap.has(slot.data)) slotsMap.set(slot.data, []);
      slotsMap.get(slot.data)!.push(slot);

      // Define se o dia está lotado ou disponível
      const currentStatus = statusMap.get(slot.data);
      if (currentStatus === "disponivel") continue; // Já achou um horário livre

      if (SELECIONAVEIS.includes(slot.status)) {
        statusMap.set(slot.data, "disponivel");
      } else {
        statusMap.set(slot.data, "lotado");
      }
    }
    return { mapaStatusDias: statusMap, slotsPorDia: slotsMap };
  }, [slotsDoMesVisivel]);

  const slotsDoDiaSelecionado = useMemo(() => {
    if (!diaSelecionado) return [];
    const dataStr = format(diaSelecionado, "yyyy-MM-dd");
    return slotsPorDia.get(dataStr) || [];
  }, [diaSelecionado, slotsPorDia]);

  // Função helper para colorir o calendário
  function getSituacaoDoDia(dia: Date): SituacaoDia {
    if (isBefore(startOfDay(dia), startOfDay(agora))) return "passado";
    const dataStr = format(dia, "yyyy-MM-dd");
    if (!mapaStatusDias.has(dataStr)) return "sem_atendimento";
    return mapaStatusDias.get(dataStr)!;
  }

  // =======================================================================
  // HANDLERS
  // =======================================================================
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

  function handleSlotSelect(slot: Slot) {
    const dataBase = parseISO(slot.data);
    const [horas, minutos] = slot.horario.split(":").map(Number);
    const dataHoraFinal = setMinutes(setHours(dataBase, horas), minutos);

    dispatch({ type: "SET_SLOT", payload: dataHoraFinal });
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

      {/* COMPONENTE CALENDÁRIO */}
      <Calendario
        mesVisivel={mesVisivel}
        diaSelecionado={diaSelecionado}
        aoSelecionarDia={setDiaSelecionado}
        aoIrMes={irMes}
        getSituacaoDoDia={getSituacaoDoDia}
      />

      <Legenda />

      {/* COMPONENTE LISTA DE SLOTS DO DIA */}
      {diaSelecionado ? (
        <ListaSlots
          dia={diaSelecionado}
          slots={slotsDoDiaSelecionado}
          slotSelecionado={slotSelecionadoAtual}
          aoSelecionar={handleSlotSelect}
        />
      ) : (
        <Texto
          cor="texto.secundario"
          alinhamento="center"
          style={{ marginTop: 16 }}
        >
          Toque em um dia disponível para ver os horários.
        </Texto>
      )}
    </ScrollView>
  );
}

// ============================================================================
// COMPONENTES DE UI INTERNOS (MANTIDOS PUROS E BURROS)
// ============================================================================

interface PropsCalendario {
  mesVisivel: Date;
  diaSelecionado?: Date;
  aoSelecionarDia: (d: Date) => void;
  aoIrMes: (delta: number) => void;
  getSituacaoDoDia: (dia: Date) => SituacaoDia;
}

function Calendario({
  mesVisivel,
  diaSelecionado,
  aoSelecionarDia,
  aoIrMes,
  getSituacaoDoDia,
}: PropsCalendario) {
  const { tema } = useTema();

  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const offsetInicial = new Date(ano, mes, 1).getDay();

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
                situacao={getSituacaoDoDia(dia)}
                selecionado={
                  !!diaSelecionado &&
                  format(dia, "yyyy-MM-dd") ===
                    format(diaSelecionado, "yyyy-MM-dd")
                }
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

function SetaMes({
  direcao,
  onPress,
}: {
  direcao: "anterior" | "proximo";
  onPress: () => void;
}) {
  const { tema } = useTema();
  return (
    <Pressable
      accessibilityRole="button"
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
        {direcao === "anterior" ? "‹" : "›"}
      </Texto>
    </Pressable>
  );
}

function CelulaDia({
  dia,
  situacao,
  selecionado,
  aoSelecionar,
}: {
  dia: Date;
  situacao: SituacaoDia;
  selecionado: boolean;
  aoSelecionar: (d: Date) => void;
}) {
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

function ListaSlots({
  dia,
  slots,
  slotSelecionado,
  aoSelecionar,
}: {
  dia: Date;
  slots: Slot[];
  slotSelecionado: Slot | null;
  aoSelecionar: (s: Slot) => void;
}) {
  const { tema } = useTema();

  if (slots.length === 0) {
    return (
      <View>
        <Texto variante="corpo" peso="negrito">
          {NOMES_DIA_SEMANA_LONGOS[dia.getDay()]}, {dia.getDate()} de{" "}
          {NOMES_MES[dia.getMonth()]}
        </Texto>
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
      <Texto
        variante="corpo"
        peso="negrito"
        style={{ marginBottom: tema.espacamento.xs }}
      >
        Horários: {NOMES_DIA_SEMANA_LONGOS[dia.getDay()]}, {dia.getDate()} de{" "}
        {NOMES_MES[dia.getMonth()]}
      </Texto>
      {/* Aqui reutilizamos o seu componente SlotItem! */}
      {slots.map((slot) => (
        <SlotItem
          key={`${slot.data}-${slot.horario}`}
          slot={slot}
          selecionado={
            !!slotSelecionado &&
            slotSelecionado.data === slot.data &&
            slotSelecionado.horario === slot.horario
          }
          onPress={aoSelecionar}
        />
      ))}
    </View>
  );
}

function Legenda() {
  const { tema } = useTema();
  const itens = Object.values(STATUS_AGENDA);

  function corStatus(status: StatusAgenda, cores: PaletaCores) {
    return cores.status[STATUS_AGENDA_ROLE[status]];
  }

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
