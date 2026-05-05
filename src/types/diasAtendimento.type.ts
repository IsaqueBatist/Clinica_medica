import { DiaSemana } from "../constants/agenda";

export interface DiasAtendimento {
  identificacao: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFim: string;
  tempoEstimado: number;
}
