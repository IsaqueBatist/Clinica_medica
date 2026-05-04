import type { StatusAgenda } from "../constants/agenda";
import type { StatusConsulta } from "../constants/consulta";
import { Tema } from "../types/theme";

export type StatusRole = keyof Tema["status"];

export const STATUS_AGENDA_ROLE: Record<StatusAgenda, StatusRole> = {
  L: "sucesso",
  M: "info",
  C: "aviso", 
  X: "erro", 
  B: "neutro", 
};

export const STATUS_CONSULTA_ROLE: Record<StatusConsulta, StatusRole> = {
  marcada: "info",
  confirmada: "info",
  realizada: "sucesso",
  encerrada: "neutro",
  canceladaPeloCliente: "aviso",
  canceladaPeloMedico: "erro",
  canceladaPorNaoComparecimento: "aviso",
};
