import { StatusPessoa } from "../../constants/pessoa";
import { Medico } from "../models/medico.type";
import { SlotAgenda } from "../models/slotAgenda.type";
import { PaginatedResult } from "./services";

interface FiltroMedico {
  status: StatusPessoa;
  crm: string;
  nome: string;
}

export type CadastrarMedicoDTO = Omit<Medico, "matricula" | "status">;
export type EditarMedicoDTO = Omit<Medico, "matricula" | "status">;

export interface ServicoMedico {
  listar(
    filtro: FiltroMedico,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Medico[]>>;
  listarHorariosDisponiveis(
    dia: Date,
    identificacao: string,
  ): Promise<SlotAgenda[]>;
  pegarPorIdentificacao(): Promise<Medico>;
  cadastrar(): Promise<Medico>;
  editar(identificacao: string, data: EditarMedicoDTO): Promise<Medico>;
  desativar(identificacao: string): Promise<void>;
}
