import { Especialidade } from "./especialidade.type";
import { Cliente } from "./cliente.type";
import { Medico } from "./medico.type";
import {
  FormaPagamento,
  SituacaoConsulta,
  TipoConsulta,
} from "../constants/consulta";

export interface Consulta {
  numero: number;
  cliente: Cliente;
  medico: Medico;
  especialidade: Especialidade;
  dataHora: Date;
  situacao: SituacaoConsulta;
  tipo: TipoConsulta;
  formaPagamento?: FormaPagamento;
  valor?: number;
  laudo?: string;
  receita?: string;
  motivoCancelamento?: string;
  procedimentos?: string;
  observacao?: string;
}
