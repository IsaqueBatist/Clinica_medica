import { Convenio } from "./convenio.type";
import { Sexo, StatusPessoa } from "../../constants/pessoa";
import { Endereco } from "./endereco.type";

export interface Cliente {
  identificacao: string;
  nome: string;
  sexo?: Sexo;
  dataNascimento?: Date;
  rg?: string;
  cpf: string;
  email?: string;
  telefones: string[];
  status: StatusPessoa;
  endereco?: Endereco;
  convenio?: Convenio;
}
