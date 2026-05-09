import { TipoConsulta } from "../../constants/consulta";
import { Cliente } from "../../types/models/cliente.type";
import { Especialidade } from "../../types/models/especialidade.type";
import { Medico } from "../../types/models/medico.type";

export type WizardStep = "cliente" | "medico" | "agenda" | "resumo";

export interface WizardState {
  step: WizardStep;
  cliente?: Cliente;
  medico?: Medico;
  especialidade?: Especialidade;
  dataHora?: Date;
  tipo?: TipoConsulta;
}

export type WizardAction =
  | { type: "SET_CLIENTE"; payload: Cliente }
  | { type: "SET_MEDICO"; payload: Medico }
  | { type: "SET_SLOT"; payload: Date }
  | { type: "SET_TIPO"; payload: TipoConsulta }
  | { type: "AVANCAR" }
  | { type: "VOLTAR" }
  | { type: "RESET" };
