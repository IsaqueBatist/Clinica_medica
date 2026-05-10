import { StatusPessoa } from "../../constants/pessoa";
import { Medico } from "../models/medico.type";
import { PaginatedResult } from "./services";

interface FiltroMedico {
  status?: StatusPessoa;
  crm?: string;
  nome?: string;
}

export type CadastrarMedicoDTO = Omit<Medico, "matricula" | "status">;
export type EditarMedicoDTO = Omit<Medico, "matricula" | "status">;

export interface ServicoMedico {
  listar(
    filtro: FiltroMedico,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Medico>>;
  pegarPorIdentificacao(identificacao: string): Promise<Medico>;
  cadastrar(data: CadastrarMedicoDTO): Promise<Medico>;
  editar(identificacao: string, data: EditarMedicoDTO): Promise<Medico>;
  desativar(identificacao: string): Promise<void>;
}
