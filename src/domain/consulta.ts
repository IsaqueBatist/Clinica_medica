import { STATUS_CONSULTA_CANCELADOS, STATUS_CONSULTA_FINALIZADOS, StatusConsulta, TipoConsulta } from "../constants/consulta";

export const isStatusFinal = (status: StatusConsulta): boolean =>
  (STATUS_CONSULTA_FINALIZADOS as readonly StatusConsulta[]).includes(status) ||
  (STATUS_CONSULTA_CANCELADOS as readonly StatusConsulta[]).includes(status);

export const canCobrar = (tipo: TipoConsulta): boolean => tipo === "nova";