export const STATUS_AGENDA = ["L", "M", "C", "X", "B"] as const;
export type StatusAgenda = (typeof STATUS_AGENDA)[number];

export const STATUS_AGENDA_LABEL: Record<StatusAgenda, string> = {
  L: "Livre",
  M: "Marcado",
  C: "Cancelado pelo cliente",
  X: "Cancelado pelo médico",
  B: "Não atende",
};

export const DIA_SEMANA = [0, 1, 2, 3, 4, 5, 6] as const;
export type DiaSemana = (typeof DIA_SEMANA)[number];

export const DIA_SEMANA_LABEL: Record<DiaSemana, string> = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};