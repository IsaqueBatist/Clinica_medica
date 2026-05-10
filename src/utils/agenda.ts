import { addDays, startOfDay, addMinutes, format, isBefore } from "date-fns";
import { StatusAgenda, STATUS_AGENDA } from "../constants/agenda";
import { STATUS_CONSULTA } from "../constants/consulta";
import { Slot } from "../types/models/agenda";
import { Consulta } from "../types/models/consulta.type";
import { Medico } from "../types/models/medico.type";

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

export function gerarSlots(
  medico: Medico,
  dataInicio: Date,
  dataFim: Date,
  consultas: Consulta[],
  agora: Date = new Date(),
): Slot[] {
  const slots: Slot[] = [];
  const diasAtendimento = medico.diasAtendimento ?? [];

  if (diasAtendimento.length === 0) return [];

  // Otimização O(1): Indexa consultas por chave 'YYYY-MM-DD-HH:mm'
  const mapaConsultas = new Map<string, Consulta>();
  for (const c of consultas) {
    if (c.medico.matricula === medico.matricula) {
      const chave = format(c.dataHora, "yyyy-MM-dd-HH:mm");
      mapaConsultas.set(chave, c);
    }
  }

  let diaAtual = startOfDay(dataInicio);
  const fim = startOfDay(dataFim);

  while (!isBefore(fim, diaAtual)) {
    const diaSemana = diaAtual.getDay();
    const atendsDoDia = diasAtendimento.filter(
      (d) => d.diaSemana === diaSemana,
    );
    const dataIso = format(diaAtual, "yyyy-MM-dd");

    if (atendsDoDia.length > 0) {
      for (const atend of atendsDoDia) {
        const [hi, mi] = atend.horaInicio.split(":").map(Number);
        const [hf, mf] = atend.horaFim.split(":").map(Number);

        let tempoIterador = new Date(diaAtual);
        tempoIterador.setHours(hi, mi, 0, 0);

        const limiteFim = new Date(diaAtual);
        limiteFim.setHours(hf, mf, 0, 0);

        while (isBefore(tempoIterador, limiteFim)) {
          if (!isBefore(tempoIterador, agora)) {
            const horarioFormatado = format(tempoIterador, "HH:mm");
            const chaveBusca = `${dataIso}-${horarioFormatado}`;
            const consultaEncontrada = mapaConsultas.get(chaveBusca);

            slots.push({
              data: dataIso,
              horario: horarioFormatado,
              status: statusDoSlotConsulta(consultaEncontrada),
              consultaNumero: consultaEncontrada?.numero,
            });
          }
          tempoIterador = addMinutes(tempoIterador, atend.tempoEstimado);
        }
      }
    }
    // Incrementa 1 dia usando date-fns (seguro contra Daylight Saving Time)
    diaAtual = addDays(diaAtual, 1);
  }

  return slots;
}
