import type { StatusAgenda } from "../constants/agenda";
import type { SituacaoConsulta } from "../constants/consulta";
import { PaletaCores } from "../types/paletaCores.type";

export type StatusRole = keyof PaletaCores["status"];

export const STATUS_AGENDA_ROLE: Record<StatusAgenda, StatusRole> = {
  L: "sucesso",
  M: "info",
  C: "aviso",
  X: "erro",
  B: "neutro",
};

export const STATUS_CONSULTA_ROLE: Record<SituacaoConsulta, StatusRole> = {
  marcada: "info",
  confirmada: "info",
  realizada: "sucesso",
  encerrada: "neutro",
  canceladaPeloCliente: "aviso",
  canceladaPeloMedico: "erro",
  canceladaPorNaoComparecimento: "aviso",
};
