import { StatusPessoa } from "../../constants/pessoa";
import { Cliente } from "../models/cliente.type";
import { PaginatedResult } from "./services";

interface FiltrosCliente {
  status?: StatusPessoa;
}

export type CadastrarClienteDTO = Pick<Cliente, "nome" | "cpf" | "telefones">;

export type EditarClienteDTO = Omit<Cliente, "rg" | "cpf" | "identificacao">;

export interface ServicoCliente {
  listar(
    filtros?: FiltrosCliente,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Cliente[]>>;
  pegarPorIdentificao(identificacao: string): Promise<Cliente>;
  cadastrar(data: CadastrarClienteDTO): Promise<Cliente>;
  editar(identificacao: string, data: EditarClienteDTO): Promise<Cliente>;
  desativar(identificacao: string): Promise<void>;
  pesquisarPorNome(
    nomeCliente: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Cliente[]>>;
}
