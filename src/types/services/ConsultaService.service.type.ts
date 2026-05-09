import { SituacaoConsulta } from "../../constants/consulta";
import { Cliente } from "../models/cliente.type";
import { Consulta } from "../models/consulta.type";
import { Medico } from "../models/medico.type";
import { PaginatedResult } from "./services";

interface FiltrosConsulta {
  medico?: Medico;
  cliente?: Cliente;
  situacao?: SituacaoConsulta;
  data?: Date;
}

export type MarcarConsultaDTO = Omit<
  Consulta,
  | "numero"
  | "situacao"
  | "formaPagamento"
  | "valor"
  | "laudo"
  | "receita"
  | "motivoCancelamento"
  | "procedimentos"
  | "observacao"
>;

export type RealizarAtendimentoMedicoDTO = Pick<
  Consulta,
  "laudo" | "receita" | "observacao"
>;

export type EncerrarConsultaDTO = Pick<
  Consulta,
  "formaPagamento" | "valor" | "procedimentos"
>;

export type CancelarConsultaDTO = Pick<Consulta, "motivoCancelamento">;

export interface ServicoConsulta {
  listar(
    filtro: FiltrosConsulta,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Consulta[]>>;
  marcarConsulta(data: MarcarConsultaDTO): Promise<Consulta>;
  realizarConsulta(
    idConsulta: string,
    data: RealizarAtendimentoMedicoDTO,
  ): Promise<void>;
  encerrarConsulta(
    idConsulta: string,
    data: EncerrarConsultaDTO,
  ): Promise<void>;
  confirmarConsulta(idConsulta: string): Promise<void>;
  cancelarConsulta(
    idConsulta: string,
    data: CancelarConsultaDTO,
  ): Promise<void>;
}
