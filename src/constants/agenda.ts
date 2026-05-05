export const STATUS_AGENDA = {
  LIVRE: "L",
  MARCADO: "M",
  CANCELADO_PELO_CLIENTE: "C",
  CANCELADO_PELO_MEDICO: "X",
  NAO_ATENDE: "B",
} as const;
export type StatusAgenda = (typeof STATUS_AGENDA)[keyof typeof STATUS_AGENDA];

export const STATUS_AGENDA_LABEL = {
  L: "Livre",
  M: "Marcado",
  C: "Cancelado pelo cliente",
  X: "Cancelado pelo médico",
  B: "Não atende",
} as const satisfies Record<StatusAgenda, string>;

export const DIA_SEMANA = {
  DOMINGO: 0,
  SEGUNDA: 1,
  TERCA: 2,
  QUARTA: 3,
  QUINTA: 4,
  SEXTA: 5,
  SABADO: 6,
} as const;
export type DiaSemana = (typeof DIA_SEMANA)[keyof typeof DIA_SEMANA];

export const DIA_SEMANA_LABEL = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
} as const satisfies Record<DiaSemana, string>;
