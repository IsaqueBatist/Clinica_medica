import type { Consulta } from "../types/models/consulta.type";
import type { SituacaoConsulta } from "../constants/consulta";

export interface FiltrosListaConsulta {
  especialidadeCodigo?: string;
  medicoMatricula?: string;
  situacao?: SituacaoConsulta;
  /** Início do intervalo (inclusivo), comparando só dia civil */
  dataInicio?: Date;
  /** Fim do intervalo (inclusivo) */
  dataFim?: Date;
}

export const FILTROS_LISTA_CONSULTA_VAZIOS: FiltrosListaConsulta = {};

export function mesmoDiaConsulta(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Horário do agendamento já passou em relação a `agora`. */
export function consultaPassou(consulta: Consulta, agora: Date): boolean {
  return consulta.dataHora.getTime() < agora.getTime();
}

export function countActiveFilters(f: FiltrosListaConsulta): number {
  let n = 0;
  if (f.especialidadeCodigo) n += 1;
  if (f.medicoMatricula) n += 1;
  if (f.situacao) n += 1;
  if (f.dataInicio) n += 1;
  if (f.dataFim) n += 1;
  return n;
}

function filtrarPorEspecialidade(
  codigo: string | undefined,
): (items: Consulta[]) => Consulta[] {
  if (!codigo) return (items) => items;
  return (items) =>
    items.filter((c) => c.medico.especialidade.codigo === codigo);
}

function filtrarPorMedico(
  matricula: string | undefined,
): (items: Consulta[]) => Consulta[] {
  if (!matricula) return (items) => items;
  return (items) => items.filter((c) => c.medico.matricula === matricula);
}

function filtrarPorSituacao(
  situacao: SituacaoConsulta | undefined,
): (items: Consulta[]) => Consulta[] {
  if (!situacao) return (items) => items;
  return (items) => items.filter((c) => c.situacao === situacao);
}

function inicioDoDia(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function filtrarPorIntervaloDatas(
  inicio: Date | undefined,
  fim: Date | undefined,
): (items: Consulta[]) => Consulta[] {
  if (!inicio && !fim) return (items) => items;
  const tInicio = inicio ? inicioDoDia(inicio) : -Infinity;
  const tFim = fim ? inicioDoDia(fim) + 86_399_999 : Infinity;
  return (items) =>
    items.filter((c) => {
      const t = inicioDoDia(c.dataHora);
      return t >= tInicio && t <= tFim;
    });
}

const etapas = (f: FiltrosListaConsulta) => [
  filtrarPorEspecialidade(f.especialidadeCodigo),
  filtrarPorMedico(f.medicoMatricula),
  filtrarPorSituacao(f.situacao),
  filtrarPorIntervaloDatas(f.dataInicio, f.dataFim),
];

/**
 * Aplica todos os filtros em sequência (AND lógico).
 */
export function aplicarFiltrosConsulta(
  items: Consulta[],
  f: FiltrosListaConsulta,
): Consulta[] {
  return etapas(f).reduce((acc, fn) => fn(acc), items);
}

/**
 * Filtros apenas especialidade + médico (tela de confirmação CONS-03).
 */
export function aplicarFiltrosConfirmacao(
  items: Consulta[],
  f: Pick<FiltrosListaConsulta, "especialidadeCodigo" | "medicoMatricula">,
): Consulta[] {
  return [filtrarPorEspecialidade(f.especialidadeCodigo), filtrarPorMedico(f.medicoMatricula)].reduce(
    (acc, fn) => fn(acc),
    items,
  );
}
