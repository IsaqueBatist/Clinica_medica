import { Especialidade } from "../types/models/especialidade.type";
import { STATUS_ENTIDADE } from "../constants/pessoa";

export const especialidadesMock: Especialidade[] = [
  { codigo: "ESP001", nome: "Clínica Geral", status: STATUS_ENTIDADE.ATIVO },
  { codigo: "ESP002", nome: "Cardiologia", status: STATUS_ENTIDADE.ATIVO },
  { codigo: "ESP003", nome: "Pediatria", status: STATUS_ENTIDADE.ATIVO },
  { codigo: "ESP004", nome: "Ortopedia", status: STATUS_ENTIDADE.ATIVO },
];
