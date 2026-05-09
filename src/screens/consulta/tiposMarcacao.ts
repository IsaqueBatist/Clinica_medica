import { TipoConsulta } from "../../constants/consulta";
import { Cliente } from "../../types/models/cliente.type";
import { Especialidade } from "../../types/models/especialidade.type";
import { Medico } from "../../types/models/medico.type";

export type Etapa = "cliente" | "medico" | "agenda" | "resumo";

export interface EstadoMarcacao {
  etapa: Etapa;
  cliente?: Cliente;
  medico?: Medico;
  especialidade?: Especialidade;
  dataHora?: Date;
  tipo?: TipoConsulta;
}

export type AcaoMarcacao =
  | { type: "SET_CLIENTE"; payload: Cliente }
  | { type: "SET_MEDICO"; payload: Medico }
  | { type: "SET_SLOT"; payload: Date }
  | { type: "SET_TIPO"; payload: TipoConsulta }
  | { type: "AVANCAR" }
  | { type: "VOLTAR" }
  | { type: "RESET" };
