/* eslint-disable no-console -- runner de teste caseiro reporta resultados via console */
import { STATUS_CONSULTA, SituacaoConsulta } from "../constants/consulta";
import { canTransition } from "./consultaStateMachine";

// Representa FirebaseError com code: "permission-denied" lançado quando
// o Firestore rejeita uma escrita por violação de security rules
export class PermissionDeniedError extends Error {
  readonly code = "permission-denied";
  constructor(de: string, para: string) {
    super(
      `[permission-denied] Transição '${de}' → '${para}' rejeitada pelas regras do Firestore.`,
    );
    this.name = "PermissionDeniedError";
  }
}

// Espelho TypeScript das regras de create e delete de firestore.rules
const isCreatePermitido = (situacao: string): boolean => situacao === "marcada";

const validarCriacaoFirestore = (situacao: string): void => {
  if (!isCreatePermitido(situacao))
    throw new PermissionDeniedError("create", `situacao=${situacao}`);
};

const validarExclusaoFirestore = (): void => {
  throw new PermissionDeniedError("delete", "always denied");
};

// Espelho TypeScript da função isTransicaoValida() de firestore.rules.
// Deve ser mantido sincronizado com o arquivo de regras manualmente.
const isTransicaoValida = (de: string, para: string): boolean =>
  (de === "marcada" &&
    [
      "confirmada",
      "canceladaPeloCliente",
      "canceladaPeloMedico",
      "canceladaPorNaoComparecimento",
    ].includes(para)) ||
  (de === "confirmada" &&
    [
      "realizada",
      "canceladaPeloCliente",
      "canceladaPeloMedico",
      "canceladaPorNaoComparecimento",
    ].includes(para)) ||
  (de === "realizada" && para === "encerrada") ||
  (de === "canceladaPorNaoComparecimento" && para === "marcada");

// Simula a validação do Firestore: lança PermissionDeniedError se a regra rejeitar
const validarEscritaFirestore = (
  de: SituacaoConsulta,
  para: SituacaoConsulta,
): void => {
  if (!isTransicaoValida(de, para)) throw new PermissionDeniedError(de, para);
};

type Caso = { nome: string; rodar: () => void };

const eq = <T>(real: T, esperado: T, contexto: string) => {
  const r = JSON.stringify(real);
  const e = JSON.stringify(esperado);
  if (r !== e) {
    throw new Error(`${contexto}\n  esperado: ${e}\n  recebido: ${r}`);
  }
};

const esperaPermissionDenied = (de: SituacaoConsulta, para: SituacaoConsulta) => {
  let erro: unknown = null;
  try {
    validarEscritaFirestore(de, para);
  } catch (e) {
    erro = e;
  }
  if (!(erro instanceof PermissionDeniedError)) {
    throw new Error(
      `esperava PermissionDeniedError para '${de}' → '${para}', recebeu: ${String(erro)}`,
    );
  }
};

const casos: Caso[] = [
  // --- Transições válidas: rules devem aceitar ---
  {
    nome: "rules aceita: marcada → confirmada",
    rodar: () => eq(isTransicaoValida("marcada", "confirmada"), true, ""),
  },
  {
    nome: "rules aceita: marcada → canceladaPeloCliente",
    rodar: () => eq(isTransicaoValida("marcada", "canceladaPeloCliente"), true, ""),
  },
  {
    nome: "rules aceita: marcada → canceladaPeloMedico",
    rodar: () => eq(isTransicaoValida("marcada", "canceladaPeloMedico"), true, ""),
  },
  {
    nome: "rules aceita: marcada → canceladaPorNaoComparecimento",
    rodar: () => eq(isTransicaoValida("marcada", "canceladaPorNaoComparecimento"), true, ""),
  },
  {
    nome: "rules aceita: confirmada → realizada",
    rodar: () => eq(isTransicaoValida("confirmada", "realizada"), true, ""),
  },
  {
    nome: "rules aceita: confirmada → canceladaPeloCliente",
    rodar: () => eq(isTransicaoValida("confirmada", "canceladaPeloCliente"), true, ""),
  },
  {
    nome: "rules aceita: confirmada → canceladaPeloMedico",
    rodar: () => eq(isTransicaoValida("confirmada", "canceladaPeloMedico"), true, ""),
  },
  {
    nome: "rules aceita: confirmada → canceladaPorNaoComparecimento",
    rodar: () => eq(isTransicaoValida("confirmada", "canceladaPorNaoComparecimento"), true, ""),
  },
  {
    nome: "rules aceita: realizada → encerrada",
    rodar: () => eq(isTransicaoValida("realizada", "encerrada"), true, ""),
  },
  {
    nome: "rules aceita: canceladaPorNaoComparecimento → marcada (operação desfazer)",
    rodar: () => eq(isTransicaoValida("canceladaPorNaoComparecimento", "marcada"), true, ""),
  },

  // --- Transições inválidas: rules devem lançar PermissionDeniedError ---
  {
    nome: "rules rejeita: marcada → realizada (pula estado confirmada)",
    rodar: () =>
      esperaPermissionDenied(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.REALIZADA),
  },
  {
    nome: "rules rejeita: marcada → encerrada (pula confirmada e realizada)",
    rodar: () =>
      esperaPermissionDenied(STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.ENCERRADA),
  },
  {
    nome: "rules rejeita: confirmada → encerrada (pula realizada)",
    rodar: () =>
      esperaPermissionDenied(STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.ENCERRADA),
  },
  {
    nome: "rules rejeita: realizada → confirmada (retrocesso)",
    rodar: () =>
      esperaPermissionDenied(STATUS_CONSULTA.REALIZADA, STATUS_CONSULTA.CONFIRMADA),
  },
  {
    nome: "rules rejeita: encerrada → marcada (estado final é irreversível)",
    rodar: () =>
      esperaPermissionDenied(STATUS_CONSULTA.ENCERRADA, STATUS_CONSULTA.MARCADA),
  },
  {
    nome: "rules rejeita: canceladaPeloCliente → marcada (cancelamento é final)",
    rodar: () =>
      esperaPermissionDenied(
        STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
        STATUS_CONSULTA.MARCADA,
      ),
  },
  {
    nome: "rules rejeita: canceladaPeloMedico → confirmada (cancelamento é final)",
    rodar: () =>
      esperaPermissionDenied(
        STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
        STATUS_CONSULTA.CONFIRMADA,
      ),
  },

  // --- Regra de create: somente situacao='marcada' é permitido ---
  {
    nome: "rules aceita create: situacao = 'marcada'",
    rodar: () => eq(isCreatePermitido("marcada"), true, "create com marcada deve ser aceito"),
  },
  {
    nome: "rules rejeita create: situacao = 'confirmada' lança PermissionDeniedError",
    rodar: () => {
      let erro: unknown = null;
      try { validarCriacaoFirestore("confirmada"); } catch (e) { erro = e; }
      if (!(erro instanceof PermissionDeniedError)) {
        throw new Error(`esperava PermissionDeniedError, recebeu: ${String(erro)}`);
      }
    },
  },
  {
    nome: "rules rejeita create: situacao = 'realizada' lança PermissionDeniedError",
    rodar: () => {
      let erro: unknown = null;
      try { validarCriacaoFirestore("realizada"); } catch (e) { erro = e; }
      if (!(erro instanceof PermissionDeniedError)) {
        throw new Error(`esperava PermissionDeniedError, recebeu: ${String(erro)}`);
      }
    },
  },
  {
    nome: "rules rejeita create: situacao = 'encerrada' lança PermissionDeniedError",
    rodar: () => {
      let erro: unknown = null;
      try { validarCriacaoFirestore("encerrada"); } catch (e) { erro = e; }
      if (!(erro instanceof PermissionDeniedError)) {
        throw new Error(`esperava PermissionDeniedError, recebeu: ${String(erro)}`);
      }
    },
  },
  // --- Regra de delete: sempre negado ---
  {
    nome: "rules rejeita delete: operação sempre lança PermissionDeniedError",
    rodar: () => {
      let erro: unknown = null;
      try { validarExclusaoFirestore(); } catch (e) { erro = e; }
      if (!(erro instanceof PermissionDeniedError)) {
        throw new Error(`esperava PermissionDeniedError para delete, recebeu: ${String(erro)}`);
      }
    },
  },

  // --- Consistência: rules e state machine devem concordar em todas as transições regulares ---
  {
    nome: "consistência: todas as transições aceitas pelas rules existem na state machine (exceto desfazer)",
    rodar: () => {
      const transicoesDasRules: [SituacaoConsulta, SituacaoConsulta][] = [
        [STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CONFIRMADA],
        [STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE],
        [STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CANCELADA_PELO_MEDICO],
        [STATUS_CONSULTA.MARCADA, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO],
        [STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.REALIZADA],
        [STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE],
        [STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.CANCELADA_PELO_MEDICO],
        [STATUS_CONSULTA.CONFIRMADA, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO],
        [STATUS_CONSULTA.REALIZADA, STATUS_CONSULTA.ENCERRADA],
      ];
      for (const [de, para] of transicoesDasRules) {
        if (!canTransition(de, para)) {
          throw new Error(
            `Inconsistência: firestore.rules aceita '${de}' → '${para}', mas consultaStateMachine rejeita`,
          );
        }
      }
    },
  },
  {
    nome: "consistência: todas as transições da state machine estão cobertas pelas rules",
    rodar: () => {
      const todosEstados = Object.values(STATUS_CONSULTA) as SituacaoConsulta[];
      const divergencias: string[] = [];
      for (const de of todosEstados) {
        for (const para of todosEstados) {
          const aceitaNaStateMachine = canTransition(de, para);
          const aceitaNasRules = isTransicaoValida(de, para);
          // desfazerNaoComparecimento é compensação especial: aceita nas rules mas não na state machine
          const ehDesfazer =
            de === STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO &&
            para === STATUS_CONSULTA.MARCADA;
          if (aceitaNaStateMachine && !aceitaNasRules && !ehDesfazer) {
            divergencias.push(`state machine aceita '${de}' → '${para}', mas rules rejeita`);
          }
        }
      }
      if (divergencias.length > 0) {
        throw new Error(
          `Transições cobertas pela state machine mas ausentes nas rules:\n  ${divergencias.join("\n  ")}`,
        );
      }
    },
  },
];

const rodarTestes = () => {
  console.log("\n=== firestoreRules ===\n");
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
