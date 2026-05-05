import { DiaSemana } from "../../constants/agenda";
import { Medico } from "./medico.type";

export interface DiasAtendimento {
  identificacao: string;
  diaSemana: DiaSemana;
  medico: Medico;
  horaInicio: string;
  horaFim: string;
  tempoEstimado: number;
}
