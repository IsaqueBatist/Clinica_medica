import { DiasAtendimento } from "../models/diasAtendimento.type";

export type RegistrarDiasAtendimento = Omit<DiasAtendimento, "identificacao">;
export type EditarDiasAtendimento = Omit<DiasAtendimento, "identificacao">;

export interface DiasAtendimentoService {
  listar(identificacaoMedico: string): Promise<DiasAtendimento>;
  registrar(data: RegistrarDiasAtendimento): Promise<DiasAtendimento>;
  editar(
    identificacao: string,
    data: EditarDiasAtendimento,
  ): Promise<RegistrarDiasAtendimento>;
  excluir(identificacao: string): Promise<void>;
}
