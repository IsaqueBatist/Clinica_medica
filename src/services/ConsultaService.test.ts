/* eslint-disable no-console -- runner de teste caseiro reporta resultados via console */
import { servicoConsulta } from "../services";
import { consultasMock } from "../mocks";
import {
  STATUS_CONSULTA,
  TIPO_CONSULTA,
  FORMA_PAGAMENTO,
  SituacaoConsulta,
  TipoConsulta,
} from "../constants/consulta";
import { TransicaoConsultaInvalidaError } from "../utils/consultaStateMachine";
import { RegraNegocioError } from "../utils/consulta";
import type { Consulta } from "../types/models/consulta.type";

type CasoAsync = { nome: string; rodar: () => Promise<void> };

const eq = <T>(real: T, esperado: T, contexto: string) => {
  const r = JSON.stringify(real);
  const e = JSON.stringify(esperado);
  if (r !== e) {
    throw new Error(`${contexto}\n  esperado: ${e}\n  recebido: ${r}`);
  }
};

// ─── Helpers de setup ────────────────────────────────────────────────────────

let contadorTeste = 0;

const criarConsultaTeste = (
  situacao: SituacaoConsulta,
  tipo: TipoConsulta = TIPO_CONSULTA.NOVA,
): string => {
  const numero = `TEST-${String(++contadorTeste).padStart(3, "0")}`;
  // Usa consultasMock[0] como template para herdar cliente/medico/dataHora válidos
  consultasMock.push({
    ...consultasMock[0],
    numero,
    situacao,
    tipo,
    laudo: undefined,
    receita: undefined,
    observacao: undefined,
    formaPagamento: undefined,
    valor: undefined,
    motivoCancelamento: undefined,
    procedimentos: undefined,
  });
  return numero;
};

const buscarConsulta = (numero: string): Consulta => {
  const c = consultasMock.find((c) => c.numero === numero);
  if (!c) throw new Error(`Consulta de teste '${numero}' não encontrada no mock`);
  return c;
};

const esperaTransicaoInvalida = async (
  fn: () => Promise<void>,
  contexto: string,
): Promise<void> => {
  let erro: unknown = null;
  try {
    await fn();
  } catch (e) {
    erro = e;
  }
  if (!(erro instanceof TransicaoConsultaInvalidaError)) {
    throw new Error(
      `${contexto}: esperava TransicaoConsultaInvalidaError, recebeu: ${String(erro)}`,
    );
  }
};

const esperaRegraNegocio = async (
  fn: () => Promise<void>,
  contexto: string,
): Promise<void> => {
  let erro: unknown = null;
  try {
    await fn();
  } catch (e) {
    erro = e;
  }
  if (!(erro instanceof RegraNegocioError)) {
    throw new Error(
      `${contexto}: esperava RegraNegocioError, recebeu: ${String(erro)}`,
    );
  }
};

const esperaErroInexistente = async (
  fn: () => Promise<void>,
  id: string,
): Promise<void> => {
  let erro: unknown = null;
  try {
    await fn();
  } catch (e) {
    erro = e;
  }
  if (!(erro instanceof Error) || !erro.message.includes(id)) {
    throw new Error(
      `esperava erro mencionando '${id}', recebeu: ${String(erro)}`,
    );
  }
};

// ─── Casos de teste ───────────────────────────────────────────────────────────

const casos: CasoAsync[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // realizarConsulta
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "realizarConsulta | happy path: CONFIRMADA → REALIZADA persiste dados médicos",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      await servicoConsulta.realizarConsulta(id, {
        laudo: "Exame clínico sem alterações",
        receita: "Dipirona 500mg 8/8h por 3 dias",
        observacao: "Retorno em 30 dias se necessário",
      });
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.REALIZADA, "situação");
      eq(c.laudo, "Exame clínico sem alterações", "laudo");
      eq(c.receita, "Dipirona 500mg 8/8h por 3 dias", "receita");
      eq(c.observacao, "Retorno em 30 dias se necessário", "observacao");
    },
  },
  {
    nome: "realizarConsulta | inválido: MARCADA → REALIZADA lança TransicaoConsultaInvalidaError e não altera estado",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      await esperaTransicaoInvalida(
        () => servicoConsulta.realizarConsulta(id, { laudo: "x" }),
        "MARCADA não pode ir para REALIZADA sem confirmar",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.MARCADA, "estado intacto após erro");
    },
  },
  {
    nome: "realizarConsulta | inválido: ENCERRADA → REALIZADA lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.ENCERRADA);
      await esperaTransicaoInvalida(
        () => servicoConsulta.realizarConsulta(id, { laudo: "x" }),
        "consulta encerrada não pode voltar para realizada",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.ENCERRADA, "estado intacto");
    },
  },
  {
    nome: "realizarConsulta | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () => servicoConsulta.realizarConsulta("NAOEXISTE-001", { laudo: "x" }),
        "NAOEXISTE-001",
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // encerrarConsulta
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "encerrarConsulta | happy path nova: REALIZADA → ENCERRADA com forma de pagamento e valor",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA, TIPO_CONSULTA.NOVA);
      await servicoConsulta.encerrarConsulta(id, {
        formaPagamento: FORMA_PAGAMENTO.PIX,
        valor: 200,
        tipo: TIPO_CONSULTA.NOVA,
      });
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.ENCERRADA, "situação");
      eq(c.formaPagamento, FORMA_PAGAMENTO.PIX, "forma de pagamento");
      eq(c.valor, 200, "valor");
    },
  },
  {
    nome: "encerrarConsulta | happy path retorno: REALIZADA → ENCERRADA isento sem valor",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA, TIPO_CONSULTA.RETORNO);
      await servicoConsulta.encerrarConsulta(id, {
        formaPagamento: FORMA_PAGAMENTO.ISENTO,
        valor: 0,
        tipo: TIPO_CONSULTA.RETORNO,
      });
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.ENCERRADA, "situação");
      eq(c.formaPagamento, FORMA_PAGAMENTO.ISENTO, "forma de pagamento");
    },
  },
  {
    nome: "encerrarConsulta | regra de negócio: retorno com valor > 0 lança RegraNegocioError e não altera estado",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA, TIPO_CONSULTA.RETORNO);
      await esperaRegraNegocio(
        () =>
          servicoConsulta.encerrarConsulta(id, {
            formaPagamento: FORMA_PAGAMENTO.PIX,
            valor: 150, // proibido para retorno
            tipo: TIPO_CONSULTA.RETORNO,
          }),
        "consulta de retorno não pode ter cobrança",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.REALIZADA, "estado intacto após RegraNegocioError");
    },
  },
  {
    nome: "encerrarConsulta | inválido: CONFIRMADA → ENCERRADA lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      await esperaTransicaoInvalida(
        () =>
          servicoConsulta.encerrarConsulta(id, {
            formaPagamento: FORMA_PAGAMENTO.DINHEIRO,
            valor: 100,
            tipo: TIPO_CONSULTA.NOVA,
          }),
        "CONFIRMADA não pode pular para ENCERRADA",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CONFIRMADA, "estado intacto após erro");
    },
  },
  {
    nome: "encerrarConsulta | inválido: MARCADA → ENCERRADA lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      await esperaTransicaoInvalida(
        () =>
          servicoConsulta.encerrarConsulta(id, {
            formaPagamento: FORMA_PAGAMENTO.PIX,
            valor: 100,
            tipo: TIPO_CONSULTA.NOVA,
          }),
        "MARCADA não pode ir para ENCERRADA",
      );
    },
  },
  {
    nome: "encerrarConsulta | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () =>
          servicoConsulta.encerrarConsulta("NAOEXISTE-002", {
            formaPagamento: FORMA_PAGAMENTO.PIX,
            valor: 100,
            tipo: TIPO_CONSULTA.NOVA,
          }),
        "NAOEXISTE-002",
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // cancelarConsulta (pelo cliente)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "cancelarConsulta | happy path: MARCADA → CANCELADA_PELO_CLIENTE persiste motivo",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      await servicoConsulta.cancelarConsulta(id, {
        motivoCancelamento: "Não poderei comparecer nessa data.",
      });
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE, "situação");
      eq(c.motivoCancelamento, "Não poderei comparecer nessa data.", "motivo");
    },
  },
  {
    nome: "cancelarConsulta | happy path: CONFIRMADA → CANCELADA_PELO_CLIENTE",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      await servicoConsulta.cancelarConsulta(id, {
        motivoCancelamento: "Emergência pessoal",
      });
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE, "situação");
    },
  },
  {
    nome: "cancelarConsulta | inválido: REALIZADA → cancelar pelo cliente lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA);
      await esperaTransicaoInvalida(
        () =>
          servicoConsulta.cancelarConsulta(id, { motivoCancelamento: "x" }),
        "consulta já realizada não pode ser cancelada pelo cliente",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.REALIZADA, "estado intacto após erro");
    },
  },
  {
    nome: "cancelarConsulta | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () =>
          servicoConsulta.cancelarConsulta("NAOEXISTE-003", {
            motivoCancelamento: "x",
          }),
        "NAOEXISTE-003",
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // cancelarConsultaMedico
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "cancelarConsultaMedico | happy path: MARCADA → CANCELADA_PELO_MEDICO persiste motivo",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      await servicoConsulta.cancelarConsultaMedico(id, {
        motivoCancelamento: "Médico convocado para cirurgia de emergência",
      });
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.CANCELADA_PELO_MEDICO, "situação");
      eq(c.motivoCancelamento, "Médico convocado para cirurgia de emergência", "motivo");
    },
  },
  {
    nome: "cancelarConsultaMedico | happy path: CONFIRMADA → CANCELADA_PELO_MEDICO",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      await servicoConsulta.cancelarConsultaMedico(id, {
        motivoCancelamento: "Feriado imprevisto",
      });
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CANCELADA_PELO_MEDICO, "situação");
    },
  },
  {
    nome: "cancelarConsultaMedico | inválido: ENCERRADA → cancelar pelo médico lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.ENCERRADA);
      await esperaTransicaoInvalida(
        () =>
          servicoConsulta.cancelarConsultaMedico(id, { motivoCancelamento: "x" }),
        "consulta encerrada não pode ser cancelada",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.ENCERRADA, "estado intacto após erro");
    },
  },
  {
    nome: "cancelarConsultaMedico | inválido: REALIZADA → cancelar pelo médico lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA);
      await esperaTransicaoInvalida(
        () =>
          servicoConsulta.cancelarConsultaMedico(id, { motivoCancelamento: "x" }),
        "consulta realizada não pode ser cancelada pelo médico",
      );
    },
  },
  {
    nome: "cancelarConsultaMedico | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () =>
          servicoConsulta.cancelarConsultaMedico("NAOEXISTE-004", {
            motivoCancelamento: "x",
          }),
        "NAOEXISTE-004",
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // cancelarPorNaoComparecimento
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "cancelarPorNaoComparecimento | happy path: MARCADA → CANCELADA_POR_NAO_COMPARECIMENTO com motivo padrão",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      await servicoConsulta.cancelarPorNaoComparecimento(id);
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO, "situação");
      eq(
        c.motivoCancelamento,
        "Paciente não compareceu ao atendimento agendado.",
        "motivo padrão deve ser aplicado automaticamente",
      );
    },
  },
  {
    nome: "cancelarPorNaoComparecimento | happy path: CONFIRMADA → CANCELADA_POR_NAO_COMPARECIMENTO",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      await servicoConsulta.cancelarPorNaoComparecimento(id);
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO, "situação");
      eq(
        c.motivoCancelamento,
        "Paciente não compareceu ao atendimento agendado.",
        "motivo padrão",
      );
    },
  },
  {
    nome: "cancelarPorNaoComparecimento | inválido: REALIZADA → não comparecimento lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.REALIZADA);
      await esperaTransicaoInvalida(
        () => servicoConsulta.cancelarPorNaoComparecimento(id),
        "consulta já realizada não pode ser marcada como não comparecimento",
      );
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.REALIZADA, "estado intacto após erro");
    },
  },
  {
    nome: "cancelarPorNaoComparecimento | inválido: ENCERRADA → não comparecimento lança TransicaoConsultaInvalidaError",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.ENCERRADA);
      await esperaTransicaoInvalida(
        () => servicoConsulta.cancelarPorNaoComparecimento(id),
        "consulta encerrada não pode receber não comparecimento",
      );
    },
  },
  {
    nome: "cancelarPorNaoComparecimento | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () => servicoConsulta.cancelarPorNaoComparecimento("NAOEXISTE-005"),
        "NAOEXISTE-005",
      );
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // desfazerNaoComparecimento
  // ═══════════════════════════════════════════════════════════════════════════
  {
    nome: "desfazerNaoComparecimento | happy path: CANCELADA_POR_NAO_COMPARECIMENTO → MARCADA limpa motivoCancelamento",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO);
      // Simula o estado que existiria após cancelarPorNaoComparecimento
      buscarConsulta(id).motivoCancelamento =
        "Paciente não compareceu ao atendimento agendado.";
      await servicoConsulta.desfazerNaoComparecimento(id);
      const c = buscarConsulta(id);
      eq(c.situacao, STATUS_CONSULTA.MARCADA, "situação restaurada para marcada");
      eq(c.motivoCancelamento, undefined, "motivoCancelamento deve ser removido");
    },
  },
  {
    nome: "desfazerNaoComparecimento | ciclo completo: cancelar → desfazer → cancelar novamente",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.MARCADA);
      // Primeira vez: cancelar
      await servicoConsulta.cancelarPorNaoComparecimento(id);
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO, "após 1º cancelamento");
      // Desfazer: volta para marcada
      await servicoConsulta.desfazerNaoComparecimento(id);
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.MARCADA, "após desfazer");
      // Segunda vez: cancelar novamente (deve funcionar)
      await servicoConsulta.cancelarPorNaoComparecimento(id);
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO, "após 2º cancelamento");
    },
  },
  {
    nome: "desfazerNaoComparecimento | inválido: CONFIRMADA → desfazer lança erro de compensação",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CONFIRMADA);
      let erro: unknown = null;
      try {
        await servicoConsulta.desfazerNaoComparecimento(id);
      } catch (e) {
        erro = e;
      }
      if (
        !(erro instanceof Error) ||
        !erro.message.includes("cancelamento automático")
      ) {
        throw new Error(
          `esperava erro de compensação inválida, recebeu: ${String(erro)}`,
        );
      }
      eq(buscarConsulta(id).situacao, STATUS_CONSULTA.CONFIRMADA, "estado intacto após erro");
    },
  },
  {
    nome: "desfazerNaoComparecimento | inválido: CANCELADA_PELO_CLIENTE → desfazer lança erro de compensação",
    async rodar() {
      const id = criarConsultaTeste(STATUS_CONSULTA.CANCELADA_PELO_CLIENTE);
      let erro: unknown = null;
      try {
        await servicoConsulta.desfazerNaoComparecimento(id);
      } catch (e) {
        erro = e;
      }
      if (
        !(erro instanceof Error) ||
        !erro.message.includes("cancelamento automático")
      ) {
        throw new Error(
          `esperava erro de compensação inválida, recebeu: ${String(erro)}`,
        );
      }
    },
  },
  {
    nome: "desfazerNaoComparecimento | não encontrada: lança erro com o id na mensagem",
    async rodar() {
      await esperaErroInexistente(
        () => servicoConsulta.desfazerNaoComparecimento("NAOEXISTE-006"),
        "NAOEXISTE-006",
      );
    },
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────────

const rodarTestes = async () => {
  console.log("\n=== ConsultaService ===\n");
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
