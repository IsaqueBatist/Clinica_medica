import { StatusAgenda } from "../../constants/agenda";

export type Slot = {
  data: string;
  horario: string;
  status: StatusAgenda;
  consultaNumero?: string;
};

export type SecaoAgenda = {
  title: string;
  data: Slot[];
};
