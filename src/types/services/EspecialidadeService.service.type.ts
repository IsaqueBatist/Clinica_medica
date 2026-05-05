import { Especialidade } from "../models/especialidade.type";

export type CriarEspecialidadeDTO = Omit<Especialidade, "codigo">;
export type EditarEspecialidadeDTO = Omit<Especialidade, "codigo">;

export interface ServicoEspecialidade {
  listar(): Promise<Especialidade[]>;
  pegarPorCodigo(codigoEspecialidade: string): Promise<Especialidade>;
  desativar(codigoEspecialidade: string): Promise<void>;
  editar(
    codigoEspecialidade: string,
    data: EditarEspecialidadeDTO,
  ): Promise<void>;
}
