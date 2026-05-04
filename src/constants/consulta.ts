export const STATUS_CONSULTA_ATIVOS = [
  "marcada",
  "confirmada",
  "realizada",
] as const;
export const STATUS_CONSULTA_CANCELADOS = [
  "canceladaPeloCliente",
  "canceladaPeloMedico",
  "canceladaPorNaoComparecimento",
] as const;
export const STATUS_CONSULTA_FINALIZADOS = ["encerrada"] as const;

export const STATUS_CONSULTA = [
  ...STATUS_CONSULTA_ATIVOS,
  ...STATUS_CONSULTA_CANCELADOS,
  ...STATUS_CONSULTA_FINALIZADOS,
] as const;
export type StatusConsulta = (typeof STATUS_CONSULTA)[number];

export const STATUS_CONSULTA_LABEL: Record<StatusConsulta, string> = {
  marcada: "Marcada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  encerrada: "Encerrada",
  canceladaPeloCliente: "Cancelada pelo cliente",
  canceladaPeloMedico: "Cancelada pelo médico",
  canceladaPorNaoComparecimento: "Cancelada por não comparecimento",
};

export const TIPO_CONSULTA = ["nova", "retorno"] as const;
export type TipoConsulta = (typeof TIPO_CONSULTA)[number];

export const TIPO_CONSULTA_LABEL: Record<TipoConsulta, string> = {
  nova: "Nova",
  retorno: "Retorno",
};

export const FORMA_PAGAMENTO = [
  "dinheiro",
  "cartaoCredito",
  "cartaoDebito",
  "pix",
  "convenio",
  "isento",
] as const;
export type FormaPagamento = (typeof FORMA_PAGAMENTO)[number];

export const FORMA_PAGAMENTO_LABEL: Record<FormaPagamento, string> = {
  dinheiro: "Dinheiro",
  cartaoCredito: "Cartão de crédito",
  cartaoDebito: "Cartão de débito",
  pix: "PIX",
  convenio: "Convênio",
  isento: "Isento",
};