/* eslint-disable no-console -- runner de teste caseiro reporta resultados via console */
import { STATUS_CONSULTA, SituacaoConsulta } from "../constants/consulta";
import {
  assertTransition,
  TransicaoConsultaInvalidaError,
} from "./consultaStateMachine";
import { runTransaction, ConflitoDTransacaoError } from "./mockTransaction";
import { consultasMock } from "../mocks";
import type { Consulta } from "../types/models/consulta.type";

type CasoAsync = { nome: string; rodar: () => Promise<void> };

const eq = <T>(real: T, esperado: T, contexto: string) => {
  const r = JSON.stringify(real);
  const e = JSON.stringify(esperado);
  if (r !== e) {
    throw new Error(`${contexto}\n  esperado: ${e}\n  recebido: ${r}`);
  }
};

// Cria consulta isolada para cada teste sem afetar consultasMock global
const novaConsulta = (numero: string, situacao: SituacaoConsulta): Consulta => ({
  ...consultasMock[0],
  numero,
  situacao,
});

const casos: CasoAsync[] = [
  {
    nome: "happy path: transação aplica escrita e avança situação",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-001", STATUS_CONSULTA.CONFIRMADA)];
      await runTransaction(mock, async (t) => {
        const c = await t.get("tx-001");
        assertTransition(c.situacao, STATUS_CONSULTA.REALIZADA);
        t.update("tx-001", { situacao: STATUS_CONSULTA.REALIZADA });
      });
      eq(mock[0].situacao, STATUS_CONSULTA.REALIZADA, "situação após commit");
    },
  },
  {
    nome: "rollback: callback lança exceção → nenhuma escrita é aplicada",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-002", STATUS_CONSULTA.CONFIRMADA)];
      let lançou = false;
      try {
        await runTransaction(mock, async (t) => {
          await t.get("tx-002");
          t.update("tx-002", { situacao: STATUS_CONSULTA.REALIZADA });
          throw new Error("falha simulada antes do commit");
        });
      } catch {
        lançou = true;
      }
      if (!lançou) throw new Error("runTransaction deveria ter propagado o erro");
      eq(mock[0].situacao, STATUS_CONSULTA.CONFIRMADA, "situação intacta após rollback");
    },
  },
  {
    nome: "rollback: transição inválida lança TransicaoConsultaInvalidaError e não aplica escrita",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-003", STATUS_CONSULTA.CONFIRMADA)];
      let erro: unknown = null;
      try {
        await runTransaction(mock, async (t) => {
          const c = await t.get("tx-003");
          assertTransition(c.situacao, STATUS_CONSULTA.ENCERRADA); // confirmada → encerrada é inválido
          t.update("tx-003", { situacao: STATUS_CONSULTA.ENCERRADA });
        });
      } catch (e) {
        erro = e;
      }
      if (!(erro instanceof TransicaoConsultaInvalidaError)) {
        throw new Error(
          `esperava TransicaoConsultaInvalidaError, recebeu: ${String(erro)}`,
        );
      }
      eq(mock[0].situacao, STATUS_CONSULTA.CONFIRMADA, "situação intacta após transição inválida");
    },
  },
  {
    nome: "concorrência: 2 chamadas simultâneas de realizarConsulta — exatamente 1 sucede e 1 lança ConflitoDTransacaoError",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-004", STATUS_CONSULTA.CONFIRMADA)];

      const transacaoRealizar = () =>
        runTransaction(mock, async (t) => {
          const c = await t.get("tx-004");
          assertTransition(c.situacao, STATUS_CONSULTA.REALIZADA);
          t.update("tx-004", { situacao: STATUS_CONSULTA.REALIZADA });
        });

      const resultados = await Promise.allSettled([
        transacaoRealizar(),
        transacaoRealizar(),
      ]);

      const aprovados = resultados.filter((r) => r.status === "fulfilled");
      const reprovados = resultados.filter((r) => r.status === "rejected");

      eq(aprovados.length, 1, "exatamente 1 transação deve ser bem-sucedida");
      eq(reprovados.length, 1, "exatamente 1 transação deve ser rejeitada");

      const rejeitado = reprovados[0];
      if (
        rejeitado.status === "rejected" &&
        !(rejeitado.reason instanceof ConflitoDTransacaoError)
      ) {
        throw new Error(
          `esperava ConflitoDTransacaoError, recebeu: ${String(rejeitado.reason)}`,
        );
      }

      eq(mock[0].situacao, STATUS_CONSULTA.REALIZADA, "estado final correto após concorrência");
    },
  },
  {
    nome: "concorrência: cancelamento duplo simultâneo — somente 1 aceito",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-005", STATUS_CONSULTA.MARCADA)];

      const transacaoCancelar = () =>
        runTransaction(mock, async (t) => {
          const c = await t.get("tx-005");
          assertTransition(c.situacao, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE);
          t.update("tx-005", {
            motivoCancelamento: "Solicitação do cliente",
            situacao: STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
          });
        });

      const resultados = await Promise.allSettled([
        transacaoCancelar(),
        transacaoCancelar(),
      ]);

      const aprovados = resultados.filter((r) => r.status === "fulfilled");
      eq(aprovados.length, 1, "somente 1 cancelamento deve ser aplicado");
      eq(mock[0].situacao, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE, "consulta deve estar cancelada");
    },
  },
  {
    nome: "consulta inexistente: lança erro com mensagem adequada",
    async rodar() {
      const mock: Consulta[] = [];
      let erro: unknown = null;
      try {
        await runTransaction(mock, async (t) => {
          await t.get("nao-existe");
        });
      } catch (e) {
        erro = e;
      }
      if (!(erro instanceof Error) || !erro.message.includes("nao-existe")) {
        throw new Error(
          `esperava erro de consulta inexistente, recebeu: ${String(erro)}`,
        );
      }
    },
  },
  {
    nome: "t.get retorna cópia imutável: mutação do objeto retornado não afeta o mock",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-006", STATUS_CONSULTA.CONFIRMADA)];
      await runTransaction(mock, async (t) => {
        const copia = await t.get("tx-006");
        // Mutar a cópia não deve contaminar o array
        (copia as Consulta).situacao = STATUS_CONSULTA.ENCERRADA;
        // Escritas só ocorrem via t.update — sem chamar t.update, nada deve mudar
      });
      eq(mock[0].situacao, STATUS_CONSULTA.CONFIRMADA, "mock intacto após mutação da cópia");
    },
  },
  {
    nome: "múltiplos t.update na mesma transação: todas as escritas são aplicadas no commit",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-007", STATUS_CONSULTA.CONFIRMADA)];
      await runTransaction(mock, async (t) => {
        await t.get("tx-007");
        t.update("tx-007", { laudo: "laudo inicial" });
        t.update("tx-007", { receita: "receita adicionada", situacao: STATUS_CONSULTA.REALIZADA });
      });
      const c = mock[0];
      eq(c.situacao, STATUS_CONSULTA.REALIZADA, "situação após dois updates");
      eq(c.laudo, "laudo inicial", "laudo do primeiro update");
      eq(c.receita, "receita adicionada", "receita do segundo update");
    },
  },
  {
    nome: "t.get retorna snapshot: modificação direta no array após leitura não altera a cópia já retornada",
    async rodar() {
      const mock: Consulta[] = [novaConsulta("tx-008", STATUS_CONSULTA.CONFIRMADA)];
      let copia: Consulta | undefined;
      await runTransaction(mock, async (t) => {
        copia = await t.get("tx-008");
        // Modificação direta no array após a leitura (simula outro agente)
        mock[0].situacao = STATUS_CONSULTA.CANCELADA_PELO_MEDICO;
        // Sem t.update: sem fase de commit, sem conflito detectado aqui
      });
      // A cópia capturada no momento do get deve refletir o estado original
      eq(copia!.situacao, STATUS_CONSULTA.CONFIRMADA, "snapshot preserva estado pré-modificação");
      // O array foi modificado externamente mas a cópia não foi afetada
      eq(mock[0].situacao, STATUS_CONSULTA.CANCELADA_PELO_MEDICO, "array reflete modificação externa");
    },
  },
];

const rodarTestes = async () => {
  console.log("\n=== mockTransaction ===\n");
  let aprovados = 0;
  const reprovados: { nome: string; erro: string }[] = [];

  for (const caso of casos) {
    try {
      await caso.rodar();
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
