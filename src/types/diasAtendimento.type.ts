import { DiaSemana } from "../constants/agenda";

export interface DiasAtendimento {
  identificacao: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFim: string;
  tempoEstimado: number;
}