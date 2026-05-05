import {
  STATUS_CONSULTA_CANCELADOS,
  STATUS_CONSULTA_FINALIZADOS,
  SituacaoConsulta,
  TipoConsulta,
} from "../constants/consulta";

export const isStatusFinal = (status: SituacaoConsulta): boolean =>
  (STATUS_CONSULTA_FINALIZADOS as readonly SituacaoConsulta[]).includes(
    status,
  ) ||
  (STATUS_CONSULTA_CANCELADOS as readonly SituacaoConsulta[]).includes(status);

export const canCobrar = (tipo: TipoConsulta): boolean => tipo === "nova";
