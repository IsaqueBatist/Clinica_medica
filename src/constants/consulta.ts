export const STATUS_CONSULTA_ATIVOS = {
  MARCADA: "marcada",
  CONFIRMADA: "confirmada",
  REALIZADA: "realizada",
} as const;

export const STATUS_CONSULTA_CANCELADOS = {
  CANCELADA_PELO_CLIENTE: "canceladaPeloCliente",
  CANCELADA_PELO_MEDICO: "canceladaPeloMedico",
  CANCELADA_POR_NAO_COMPARECIMENTO: "canceladaPorNaoComparecimento",
} as const;

export const STATUS_CONSULTA_FINALIZADOS = {
  ENCERRADA: "encerrada",
} as const;

export const STATUS_CONSULTA = {
  ...STATUS_CONSULTA_ATIVOS,
  ...STATUS_CONSULTA_CANCELADOS,
  ...STATUS_CONSULTA_FINALIZADOS,
} as const;
export type SituacaoConsulta =
  (typeof STATUS_CONSULTA)[keyof typeof STATUS_CONSULTA];

export const STATUS_CONSULTA_LABEL: Record<SituacaoConsulta, string> = {
  marcada: "Marcada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  encerrada: "Encerrada",
  canceladaPeloCliente: "Cancelada pelo cliente",
  canceladaPeloMedico: "Cancelada pelo médico",
  canceladaPorNaoComparecimento: "Cancelada por não comparecimento",
};

export const TIPO_CONSULTA = {
  NOVA: "nova",
  RETORNO: "retorno",
} as const;
export type TipoConsulta = (typeof TIPO_CONSULTA)[keyof typeof TIPO_CONSULTA];

export const TIPO_CONSULTA_LABEL: Record<TipoConsulta, string> = {
  nova: "Nova",
  retorno: "Retorno",
};

export const FORMA_PAGAMENTO = {
  DINHEIRO: "dinheiro",
  CARTAO_CREDITO: "cartaoCredito",
  CARTAO_DEBITO: "cartaoDebito",
  PIX: "pix",
  CONVENIO: "convenio",
  ISENTO: "isento",
} as const;
export type FormaPagamento =
  (typeof FORMA_PAGAMENTO)[keyof typeof FORMA_PAGAMENTO];

export const FORMA_PAGAMENTO_LABEL: Record<FormaPagamento, string> = {
  dinheiro: "Dinheiro",
  cartaoCredito: "Cartão de crédito",
  cartaoDebito: "Cartão de débito",
  pix: "PIX",
  convenio: "Convênio",
  isento: "Isento",
};
