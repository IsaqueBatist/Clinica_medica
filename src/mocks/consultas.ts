import { Consulta } from "../types/models/consulta.type";
import { clientesMock } from "./clientes";
import { medicosMock } from "./medicos";
import {
  FORMA_PAGAMENTO,
  STATUS_CONSULTA,
  TIPO_CONSULTA,
} from "../constants/consulta";

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
    dataHora: new Date("2026-05-10T10:30:00"),
    situacao: STATUS_CONSULTA.MARCADA,
    tipo: TIPO_CONSULTA.NOVA,
  },
  {
    numero: "1002",
    cliente: cli002JoaoPedro,
    medico: med003Pediatra,
    dataHora: new Date("2026-05-10T11:00:00"),
    situacao: STATUS_CONSULTA.CONFIRMADA,
    tipo: TIPO_CONSULTA.RETORNO,
    observacao: "Paciente confirmou presença pelo telefone às 09h.",
  },
  {
    numero: "1003",
    cliente: cli007Roberto,
    medico: med004Ortopedista,
    dataHora: new Date("2026-05-02T09:00:00"),
    situacao: STATUS_CONSULTA.REALIZADA,
    tipo: TIPO_CONSULTA.NOVA,
    formaPagamento: FORMA_PAGAMENTO.CONVENIO,
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
    situacao: STATUS_CONSULTA.ENCERRADA,
    tipo: TIPO_CONSULTA.NOVA,
    formaPagamento: FORMA_PAGAMENTO.PIX,
    valor: 200,
    laudo: "Quadro gripal leve, sem complicações.",
    receita: "Sintomáticos por 5 dias.",
  },
  {
    numero: "1005",
    cliente: cli003Carlos,
    medico: med002Cardiologista,
    dataHora: new Date("2026-05-14T14:00:00"),
    situacao: STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    tipo: TIPO_CONSULTA.RETORNO,
    motivoCancelamento: "Paciente reagendou para o próximo mês por viagem.",
  },
  {
    numero: "1006",
    cliente: cli001Mariana,
    medico: med004Ortopedista,
    dataHora: new Date("2026-04-22T10:00:00"),
    situacao: STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
    tipo: TIPO_CONSULTA.NOVA,
    motivoCancelamento: "Médico chamado para emergência hospitalar.",
  },
  {
    numero: "1007",
    cliente: cli009Sam,
    medico: med005ClinicaGeralInativo,
    dataHora: new Date("2026-04-10T13:30:00"),
    situacao: STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
    tipo: TIPO_CONSULTA.NOVA,
    motivoCancelamento: "Cliente não compareceu e não justificou ausência.",
  },
  {
    numero: "1008",
    cliente: cli007Roberto,
    medico: med002Cardiologista,
    dataHora: new Date("2026-06-02T14:30:00"),
    situacao: STATUS_CONSULTA.MARCADA,
    tipo: TIPO_CONSULTA.RETORNO,
  },
];

/** Consultas com data relativa a “hoje” para CONS-03 / fluxos locais. */
(function seedConsultasHoje() {
  const agora = new Date();
  const futuroHoje = new Date(agora);
  futuroHoje.setHours(23, 30, 0, 0);
  if (futuroHoje <= agora) {
    futuroHoje.setTime(agora.getTime() + 90 * 60_000);
  }

  const passadoHoje = new Date(agora);
  passadoHoje.setTime(agora.getTime() - 3 * 60 * 60_000);

  const confirmadaHoje = new Date(agora);
  confirmadaHoje.setTime(agora.getTime() + 2 * 60 * 60_000);

  const realizadaHoje = new Date(agora);
  realizadaHoje.setTime(agora.getTime() + 60 * 60_000);

  consultasMock.push(
    {
      numero: "1901",
      cliente: cli002JoaoPedro,
      medico: med001ClinicaGeral,
      dataHora: futuroHoje,
      situacao: STATUS_CONSULTA.MARCADA,
      tipo: TIPO_CONSULTA.NOVA,
    },
    {
      numero: "1902",
      cliente: cli003Carlos,
      medico: med002Cardiologista,
      dataHora: passadoHoje,
      situacao: STATUS_CONSULTA.MARCADA,
      tipo: TIPO_CONSULTA.NOVA,
    },
    {
      numero: "1903",
      cliente: cli005Lucas,
      medico: med003Pediatra,
      dataHora: confirmadaHoje,
      situacao: STATUS_CONSULTA.CONFIRMADA,
      tipo: TIPO_CONSULTA.NOVA,
    },
    {
      numero: "1904",
      cliente: cli001Mariana,
      medico: med004Ortopedista,
      dataHora: realizadaHoje,
      situacao: STATUS_CONSULTA.REALIZADA,
      tipo: TIPO_CONSULTA.NOVA,
      laudo: "Evolução favorável.",
      receita: "",
      observacao: "Pendente encerramento administrativo.",
    },
  );
})();
