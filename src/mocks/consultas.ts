import { Consulta } from "../types/models/consulta.type";
import { clientesMock } from "./clientes";
import { medicosMock } from "./medicos";

const [
  med001ClinicaGeral,
  med002Cardiologista,
  med003Pediatra,
  med004Ortopedista,
  med005ClinicaGeralInativo,
] = medicosMock;

const [
  cli001Mariana,
  cli002JoaoPedro,
  cli003Carlos,
  ,
  cli005Lucas,
  ,
  cli007Roberto,
  ,
  cli009Sam,
] = clientesMock;

export const consultasMock: Consulta[] = [
  {
    numero: "1001",
    cliente: cli001Mariana,
    medico: med001ClinicaGeral,
    dataHora: new Date("2026-05-20T10:30:00"),
    situacao: "marcada",
    tipo: "nova",
  },
  {
    numero: "1002",
    cliente: cli002JoaoPedro,
    medico: med003Pediatra,
    dataHora: new Date("2026-05-04T11:00:00"),
    situacao: "confirmada",
    tipo: "retorno",
    observacao: "Paciente confirmou presença pelo telefone às 09h.",
  },
  {
    numero: "1003",
    cliente: cli007Roberto,
    medico: med004Ortopedista,
    dataHora: new Date("2026-05-02T09:00:00"),
    situacao: "realizada",
    tipo: "nova",
    formaPagamento: "convenio",
    valor: 250,
    laudo:
      "Artrose moderada em joelho direito. Sem indicação cirúrgica imediata.",
    receita: "Anti-inflamatório 7 dias + fisioterapia 2x semana.",
    procedimentos: "Avaliação clínica + radiografia do joelho.",
  },
  {
    numero: "1004",
    cliente: cli005Lucas,
    medico: med001ClinicaGeral,
    dataHora: new Date("2026-04-15T08:30:00"),
    situacao: "encerrada",
    tipo: "nova",
    formaPagamento: "pix",
    valor: 200,
    laudo: "Quadro gripal leve, sem complicações.",
    receita: "Sintomáticos por 5 dias.",
  },
  {
    numero: "1005",
    cliente: cli003Carlos,
    medico: med002Cardiologista,
    dataHora: new Date("2026-05-14T14:00:00"),
    situacao: "canceladaPeloCliente",
    tipo: "retorno",
    motivoCancelamento: "Paciente reagendou para o próximo mês por viagem.",
  },
  {
    numero: "1006",
    cliente: cli001Mariana,
    medico: med004Ortopedista,
    dataHora: new Date("2026-04-22T10:00:00"),
    situacao: "canceladaPeloMedico",
    tipo: "nova",
    motivoCancelamento: "Médico chamado para emergência hospitalar.",
  },
  {
    numero: "1007",
    cliente: cli009Sam,
    medico: med005ClinicaGeralInativo,
    dataHora: new Date("2026-04-10T13:30:00"),
    situacao: "canceladaPorNaoComparecimento",
    tipo: "nova",
    motivoCancelamento: "Cliente não compareceu e não justificou ausência.",
  },
  {
    numero: "1008",
    cliente: cli007Roberto,
    medico: med002Cardiologista,
    dataHora: new Date("2026-06-02T14:30:00"),
    situacao: "marcada",
    tipo: "retorno",
  },
];
