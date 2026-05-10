import {
  STATUS_CONSULTA_CANCELADOS,
  STATUS_CONSULTA_FINALIZADOS,
  SituacaoConsulta,
  TIPO_CONSULTA,
  TipoConsulta,
} from "../constants/consulta";

export class RegraNegocioError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "RegraNegocioError";
  }
}

export const isStatusFinal = (status: SituacaoConsulta): boolean =>
  (Object.values(STATUS_CONSULTA_FINALIZADOS) as SituacaoConsulta[]).includes(
    status,
  ) ||
  (Object.values(STATUS_CONSULTA_CANCELADOS) as SituacaoConsulta[]).includes(
    status,
  );

export const canCobrar = (tipo: TipoConsulta): boolean =>
  tipo === TIPO_CONSULTA.NOVA;

export const validarRegrasEncerramento = (
  tipo: TipoConsulta,
  valor?: number,
): void => {
  if (!canCobrar(tipo) && valor && valor > 0) {
    throw new RegraNegocioError(
      "Violação de invariante: Consultas de retorno não podem conter valores de cobrança associados.",
    );
  }
};
