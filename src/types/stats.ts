import { Consulta } from "../types/models/consulta.type";
import {
  STATUS_CONSULTA,
  STATUS_CONSULTA_CANCELADOS,
  SituacaoConsulta,
} from "../constants/consulta";
import { canCobrar, isStatusFinal } from "../utils/consulta";

export type Periodo = "hoje" | "semana" | "mes";

// ─── 1. Filtrar por período ───────────────────────────────────────────────────
// Sem alteração — lógica correta.
export function filtrarPorPeriodo(
  consultas: Consulta[],
  periodo: Periodo,
): Consulta[] {
  const agora = new Date();
  const inicio = new Date(agora);
  const fim = new Date(agora);

  if (periodo === "hoje") {
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);
  } else if (periodo === "semana") {
    inicio.setDate(agora.getDate() - agora.getDay());
    inicio.setHours(0, 0, 0, 0);
    fim.setDate(inicio.getDate() + 6);
    fim.setHours(23, 59, 59, 999);
  } else if (periodo === "mes") {
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    fim.setFullYear(agora.getFullYear(), agora.getMonth() + 1, 0);
    fim.setHours(23, 59, 59, 999);
  }

  return consultas.filter((c) => {
    const dataConsulta = new Date(c.dataHora);
    return dataConsulta >= inicio && dataConsulta <= fim;
  });
}

// ─── 2. Contagem por status ───────────────────────────────────────────────────
// Sem alteração — lógica correta.
export function consultasPorStatus(
  consultas: Consulta[],
): Record<SituacaoConsulta, number> {
  const contagem = Object.values(STATUS_CONSULTA).reduce(
    (acc, status) => {
      acc[status as SituacaoConsulta] = 0;
      return acc;
    },
    {} as Record<SituacaoConsulta, number>,
  );

  consultas.forEach((c) => {
    if (contagem[c.situacao] !== undefined) {
      contagem[c.situacao]++;
    }
  });

  return contagem;
}

// ─── 3. Faturamento do período ────────────────────────────────────────────────
// CORREÇÃO: o filtro estava invertido.
// `canCobrar(tipo)` retorna true para consultas que PODEM ser cobradas (novas).
// O código anterior usava `!canCobrar`, somando só os retornos (não cobráveis).
// Correto: incluir apenas consultas finalizadas E que podem ser cobradas.
export function faturamentoPeriodo(consultas: Consulta[]): number {
  return consultas
    .filter(
      (c) =>
        // Só conta o que pode ser cobrado (novas consultas, não retornos)
        canCobrar(c.tipo) &&
        // Só conta quando o ciclo financeiro está completo
        (c.situacao === STATUS_CONSULTA.ENCERRADA ||
          c.situacao === STATUS_CONSULTA.REALIZADA),
    )
    .reduce((total, c) => {
      // Sanitiza o valor para aceitar tanto number puro quanto string formatada
      // (ex: "R$ 1.500,00" vindo de uma fonte legada)
      const valorBruto = String(c.valor ?? "0");
      const valorSanitizado = valorBruto
        .replace(/R\$\s?/gi, "")
        .replace(/\./g, "")
        .replace(",", ".");
      const valorNumerico = parseFloat(valorSanitizado);
      return total + (Number.isNaN(valorNumerico) ? 0 : valorNumerico);
    }, 0);
}

export function totalConsultasPeriodo(consultas: Consulta[]): number {
  return consultas.length;
}

// ─── 4. Taxa de no-show ───────────────────────────────────────────────────────
// CORREÇÃO: o denominador estava errado.
//
// Problema original: `isStatusFinal` incluía cancelamentos pelo cliente/médico
// e realizadas/encerradas — misturando faltas voluntárias com atendimentos
// efetivos e cancelamentos justificados. Isso inflava o denominador e tornava
// a taxa de no-show artificialmente baixa.
//
// Regra de negócio correta (conforme estudo de caso):
//   - Denominador: consultas que chegaram ao dia do atendimento
//     (confirmadas + realizadas + encerradas + não comparecimento)
//   - Numerador: só CANCELADA_POR_NAO_COMPARECIMENTO
//
// Cancelamentos pelo cliente/médico acontecem ANTES do dia — o paciente nunca
// "deveria ter comparecido", portanto não entram no cálculo.
export function taxaNoShow(consultas: Consulta[]): number {
  const STATUS_COMPARECEU_AO_DIA: SituacaoConsulta[] = [
    STATUS_CONSULTA.CONFIRMADA,
    STATUS_CONSULTA.REALIZADA,
    STATUS_CONSULTA.ENCERRADA,
    STATUS_CONSULTA_CANCELADOS.CANCELADA_POR_NAO_COMPARECIMENTO,
  ];

  const consultasNoDia = consultas.filter((c) =>
    STATUS_COMPARECEU_AO_DIA.includes(c.situacao),
  );

  const totalNoDia = consultasNoDia.length;
  if (totalNoDia === 0) return 0;

  const faltas = consultasNoDia.filter(
    (c) =>
      c.situacao ===
      STATUS_CONSULTA_CANCELADOS.CANCELADA_POR_NAO_COMPARECIMENTO,
  ).length;

  return (faltas / totalNoDia) * 100;
}

// ─── 5. Top médicos ───────────────────────────────────────────────────────────
// CORREÇÃO: o original contava consultas canceladas no ranking, distorcendo
// quem realmente atendeu mais.
// Agora filtra apenas consultas realizadas ou encerradas — atendimentos efetivos.
export function topMedicos(
  consultas: Consulta[],
  n: number,
): { medicoId: string; nome: string; count: number }[] {
  const contagem: Record<string, { nome: string; count: number }> = {};

  consultas
    .filter(
      (c) =>
        c.situacao === STATUS_CONSULTA.REALIZADA ||
        c.situacao === STATUS_CONSULTA.ENCERRADA,
    )
    .forEach((c) => {
      const id = c.medico.matricula;
      if (!contagem[id]) contagem[id] = { nome: c.medico.nome, count: 0 };
      contagem[id].count++;
    });

  return Object.entries(contagem)
    .map(([medicoId, dados]) => ({ medicoId, ...dados }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
