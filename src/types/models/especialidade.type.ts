import { StatusPessoa } from "../../constants/pessoa";

export interface Especialidade {
  codigo: string;
  nome: string;
  status: StatusPessoa;
}
