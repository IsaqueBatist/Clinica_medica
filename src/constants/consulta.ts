import { VarianteBadge } from "../components/ui/Badge";

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

export const STATUS_CONSULTA_LABEL = {
  marcada: "Marcada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  canceladaPeloCliente: "Cancelada pelo cliente",
  canceladaPeloMedico: "Cancelada pelo médico",
  canceladaPorNaoComparecimento: "Cancelada por não comparecimento",
  encerrada: "Encerrada",
} as const satisfies Record<SituacaoConsulta, string>;

export const STATUS_CONSULTA_VARIANTE = {
  marcada: "info",
  confirmada: "marca",
  realizada: "sucesso",
  canceladaPeloCliente: "erro",
  canceladaPeloMedico: "erro",
  canceladaPorNaoComparecimento: "aviso",
  encerrada: "neutro",
} as const satisfies Record<SituacaoConsulta, VarianteBadge>;

export const TIPO_CONSULTA = {
  NOVA: "nova",
  RETORNO: "retorno",
} as const;
export type TipoConsulta = (typeof TIPO_CONSULTA)[keyof typeof TIPO_CONSULTA];

export const TIPO_CONSULTA_LABEL = {
  nova: "Nova",
  retorno: "Retorno",
} as const satisfies Record<TipoConsulta, string>;

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

export const FORMA_PAGAMENTO_LABEL = {
  dinheiro: "Dinheiro",
  cartaoCredito: "Cartão de crédito",
  cartaoDebito: "Cartão de débito",
  pix: "PIX",
  convenio: "Convênio",
  isento: "Isento",
} as const satisfies Record<FormaPagamento, string>;
