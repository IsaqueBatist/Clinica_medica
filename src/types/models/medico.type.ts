import { StatusPessoa } from "../../constants/pessoa";
import { DiasAtendimento } from "./diasAtendimento.type";
import { Endereco } from "./endereco.type";
import { Especialidade } from "./especialidade.type";

export interface Medico {
  matricula: string;
  nome: string;
  crm: string;
  endereco: Endereco;
  telefones: string[];
  especialidade: Especialidade;
  diasAtendimento?: DiasAtendimento[];
  status: StatusPessoa;
}
