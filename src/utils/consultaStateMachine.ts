import { STATUS_CONSULTA, SituacaoConsulta } from "../constants/consulta";

const transicoes: Record<SituacaoConsulta, SituacaoConsulta[]> = {
  [STATUS_CONSULTA.MARCADA]: [
    STATUS_CONSULTA.CONFIRMADA,
    STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
    STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
  ],
  [STATUS_CONSULTA.CONFIRMADA]: [
    STATUS_CONSULTA.REALIZADA,
    STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
    STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
  ],
  [STATUS_CONSULTA.REALIZADA]: [STATUS_CONSULTA.ENCERRADA],
  [STATUS_CONSULTA.ENCERRADA]: [],
  [STATUS_CONSULTA.CANCELADA_PELO_CLIENTE]: [],
  [STATUS_CONSULTA.CANCELADA_PELO_MEDICO]: [],
  [STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO]: [],
};

export class TransicaoConsultaInvalidaError extends Error {
  constructor(
    public readonly de: SituacaoConsulta,
    public readonly para: SituacaoConsulta,
  ) {
    super(`Transição inválida de "${de}" para "${para}".`);
    this.name = "TransicaoConsultaInvalidaError";
  }
}

export const canTransition = (
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): boolean => transicoes[de].includes(para);

export const assertTransition = (
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): void => {
  if (!canTransition(de, para)) {
    throw new TransicaoConsultaInvalidaError(de, para);
  }
};

export const getAvailableTransitions = (
  de: SituacaoConsulta,
): SituacaoConsulta[] => [...transicoes[de]];
