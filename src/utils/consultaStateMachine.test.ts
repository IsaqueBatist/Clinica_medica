import { STATUS_CONSULTA } from "../constants/consulta";
import {
  assertTransition,
  canTransition,
  getAvailableTransitions,
  TransicaoConsultaInvalidaError,
} from "./consultaStateMachine";

type Caso = { nome: string; rodar: () => void };

const eq = <T>(real: T, esperado: T, contexto: string) => {
  const r = JSON.stringify(real);
  const e = JSON.stringify(esperado);
  if (r !== e) {
    throw new Error(`${contexto}\n  esperado: ${e}\n  recebido: ${r}`);
  }
};

const casos: Caso[] = [
  {
    nome: "canTransition(marcada → realizada) é false (precisa confirmar antes)",
    rodar: () =>
      eq(
        canTransition(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.REALIZADA),
        false,
        "marcada não pode pular direto para realizada",
      ),
  },
  {
    nome: "canTransition(encerrada → marcada) é false (estado final)",
    rodar: () =>
      eq(
        canTransition(STATUS_CONSULTA.ENCERRADA, STATUS_CONSULTA.MARCADA),
        false,
        "encerrada é estado final, não pode voltar",
      ),
  },
  {
    nome: "canTransition(marcada → confirmada) é true",
    rodar: () =>
      eq(
        canTransition(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CONFIRMADA),
        true,
        "marcada → confirmada é o caminho normal",
      ),
  },
  {
    nome: "canTransition(confirmada → realizada) é true",
    rodar: () =>
      eq(
        canTransition(STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.REALIZADA),
        true,
        "confirmada → realizada é o caminho normal",
      ),
  },
  {
    nome: "canTransition(realizada → encerrada) é true",
    rodar: () =>
      eq(
        canTransition(STATUS_CONSULTA.REALIZADA, STATUS_CONSULTA.ENCERRADA),
        true,
        "realizada → encerrada é o caminho normal",
      ),
  },
  {
    nome: "getAvailableTransitions(confirmada) retorna realizada e cancelamentos válidos",
    rodar: () =>
      eq(
        getAvailableTransitions(STATUS_CONSULTA.CONFIRMADA).sort(),
        [
          STATUS_CONSULTA.REALIZADA,
          STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
          STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
        ].sort(),
        "confirmada permite realizar, cancelar pelo cliente ou marcar não-comparecimento",
      ),
  },
  {
    nome: "getAvailableTransitions(encerrada) é []",
    rodar: () =>
      eq(
        getAvailableTransitions(STATUS_CONSULTA.ENCERRADA),
        [],
        "estado final não tem saídas",
      ),
  },
  {
    nome: "getAvailableTransitions(canceladaPeloCliente) é []",
    rodar: () =>
      eq(
        getAvailableTransitions(STATUS_CONSULTA.CANCELADA_PELO_CLIENTE),
        [],
        "cancelamento é estado final",
      ),
  },
  {
    nome: "getAvailableTransitions retorna nova referência (proteção contra mutação)",
    rodar: () => {
      const a = getAvailableTransitions(STATUS_CONSULTA.MARCADA);
      a.push(STATUS_CONSULTA.ENCERRADA);
      const b = getAvailableTransitions(STATUS_CONSULTA.MARCADA);
      eq(
        b.includes(STATUS_CONSULTA.ENCERRADA),
        false,
        "mutar a cópia não pode contaminar o mapa interno",
      );
    },
  },
  {
    nome: "assertTransition lança TransicaoConsultaInvalidaError em transição inválida",
    rodar: () => {
      let erro: unknown = null;
      try {
        assertTransition(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.ENCERRADA);
      } catch (e) {
        erro = e;
      }
      if (!(erro instanceof TransicaoConsultaInvalidaError)) {
        throw new Error(
          `esperava TransicaoConsultaInvalidaError, recebeu: ${String(erro)}`,
        );
      }
    },
  },
  {
    nome: "assertTransition não lança em transição válida",
    rodar: () =>
      assertTransition(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CONFIRMADA),
  },
];

const rodarTestes = () => {
  let aprovados = 0;
  const reprovados: { nome: string; erro: string }[] = [];

  for (const caso of casos) {
    try {
      caso.rodar();
      aprovados += 1;
      console.log(`  ok  ${caso.nome}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      reprovados.push({ nome: caso.nome, erro: msg });
      console.log(`  X   ${caso.nome}\n      ${msg}`);
    }
  }

  console.log(
    `\n${aprovados}/${casos.length} aprovados, ${reprovados.length} reprovados`,
  );

  if (reprovados.length > 0) {
    process.exit(1);
  }
};

rodarTestes();
