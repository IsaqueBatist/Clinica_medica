import {
  STATUS_CONSULTA_CANCELADOS,
  STATUS_CONSULTA_FINALIZADOS,
  SituacaoConsulta,
  TIPO_CONSULTA,
  TipoConsulta,
} from "../constants/consulta";

export const isStatusFinal = (status: SituacaoConsulta): boolean =>
  (Object.values(STATUS_CONSULTA_FINALIZADOS) as SituacaoConsulta[]).includes(
    status,
  ) ||
  (Object.values(STATUS_CONSULTA_CANCELADOS) as SituacaoConsulta[]).includes(
    status,
  );

export const canCobrar = (tipo: TipoConsulta): boolean =>
  tipo === TIPO_CONSULTA.NOVA;
