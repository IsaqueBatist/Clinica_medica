import { gerarSlots } from "./agenda";
import { STATUS_AGENDA } from "../constants/agenda";
import { STATUS_CONSULTA } from "../constants/consulta";
import type { Medico } from "../types/models/medico.type";
import type { Consulta } from "../types/models/consulta.type";
import { medicosMock } from "../mocks";

// Mocks básicos para teste em Node

const medicoMock = medicosMock[0];

const inicio = new Date(2026, 4, 11); // 11/05/2026 (Segunda)
const fim = new Date(2026, 4, 11);
const agora = new Date(2026, 4, 10); // Passado, para não filtrar

console.log("Executando testes da regra de domínio: gerarSlots...");

// Caso 1: Médico que atende, sem consultas (4 horas / 30 min = 8 slots)
const slotsCaso1 = gerarSlots(medicoMock, inicio, fim, [], agora);
if (slotsCaso1.length !== 8)
  console.error("Falha no Caso 1: Deveria gerar 8 slots.");
if (slotsCaso1[0].status !== STATUS_AGENDA.LIVRE)
  console.error("Falha no Caso 1: Slot deveria ser Livre.");

// Caso 2: Slot ocupado por consulta
const consultaMock: Consulta = {
  numero: "001",
  situacao: STATUS_CONSULTA.MARCADA,
  medico: medicoMock,
  cliente: {
    identificacao: "1",
    nome: "Cliente",
    email: "c@c.com",
    cpf: "49276892800",
    telefones: ["11963995039"],
    status: "ativo",
  },
  dataHora: new Date(2026, 4, 11, 8, 30),
  tipo: "nova",
};

const slotsCaso2 = gerarSlots(medicoMock, inicio, fim, [consultaMock], agora);
const slotOcupado = slotsCaso2.find((s) => s.horario === "08:30");
if (slotOcupado?.status !== STATUS_AGENDA.MARCADO) {
  console.error("Falha no Caso 2: O slot 08:30 deveria estar Marcado.");
}

// Caso 3: Médico que não atende no dia (Terça-feira, dia 12)
const slotsCaso3 = gerarSlots(
  medicoMock,
  new Date(2026, 4, 12),
  new Date(2026, 4, 12),
  [],
  agora,
);
if (slotsCaso3.length !== 0)
  console.error(
    "Falha no Caso 3: Não deveria gerar slots em dia sem expediente.",
  );

console.log("Testes finalizados.");
