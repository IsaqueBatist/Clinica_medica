import { consultasMock } from "../mocks";
import { STATUS_CONSULTA } from "../constants/consulta";
import { Consulta } from "../types/models/consulta.type";
import { ServicoConsulta } from "../types/services/ConsultaService.service.type";
import { delay } from "../utils/delay";
import { assertTransition } from "../utils/consultaStateMachine";

const mesmoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const servicoConsulta: ServicoConsulta = {
  async listar(filtro = {}, page = 1, limit = 10) {
    await delay();

    if (page < 1 || limit < 1) {
      throw new Error(
        "Parâmetros de paginação (page, limit) devem ser maiores que zero.",
      );
    }

    let filtrados = consultasMock;

    if (filtro.medico) {
      const matricula = filtro.medico.matricula;
      filtrados = filtrados.filter((c) => c.medico.matricula === matricula);
    }
    if (filtro.cliente) {
      const id = filtro.cliente.identificacao;
      filtrados = filtrados.filter((c) => c.cliente.identificacao === id);
    }
    if (filtro.situacao) {
      filtrados = filtrados.filter((c) => c.situacao === filtro.situacao);
    }
    if (filtro.data) {
      const data = filtro.data;
      filtrados = filtrados.filter((c) => mesmoDia(c.dataHora, data));
    }

    const total = filtrados.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const data = filtrados
      .slice(offset, offset + limit)
      .map((consulta) => ({ ...consulta }));

    return {
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
      },
    };
  },

  async marcarConsulta(data) {
    await delay();

    const proximoNumero = consultasMock.length + 1001;
    const novaConsulta: Consulta = {
      numero: String(proximoNumero),
      situacao: STATUS_CONSULTA.MARCADA,
      ...data,
    };

    consultasMock.push(novaConsulta);

    return { ...novaConsulta };
  },

  async realizarConsulta(idConsulta, data) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(consultasMock[index].situacao, STATUS_CONSULTA.REALIZADA);

    consultasMock[index] = {
      ...consultasMock[index],
      ...data,
      situacao: STATUS_CONSULTA.REALIZADA,
    };
  },

  async encerrarConsulta(idConsulta, data) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(consultasMock[index].situacao, STATUS_CONSULTA.ENCERRADA);

    consultasMock[index] = {
      ...consultasMock[index],
      ...data,
      situacao: STATUS_CONSULTA.ENCERRADA,
    };
  },

  async confirmarConsulta(idConsulta) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(consultasMock[index].situacao, STATUS_CONSULTA.CONFIRMADA);

    consultasMock[index].situacao = STATUS_CONSULTA.CONFIRMADA;
  },

  async cancelarConsulta(idConsulta, data) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(
      consultasMock[index].situacao,
      STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    );

    consultasMock[index] = {
      ...consultasMock[index],
      ...data,
      situacao: STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
    };
  },
  async cancelarConsultaMedico(idConsulta, data) {
    await delay();
    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(
      consultasMock[index].situacao,
      STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
    );

    consultasMock[index] = {
      ...consultasMock[index],
      ...data,
      situacao: STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
    };
  },

  async cancelarPorNaoComparecimento(idConsulta) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    assertTransition(
      consultasMock[index].situacao,
      STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
    );

    consultasMock[index] = {
      ...consultasMock[index],
      motivoCancelamento: "Paciente não compareceu ao atendimento agendado.",
      situacao: STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO,
    };
  },

  // Compensação do auto-cancelamento por não comparecimento. Não é uma
  // transição da state machine — é um undo da ação do temporizador, válido
  // só enquanto a consulta ainda está no estado cancelado por ele.
  async desfazerNaoComparecimento(idConsulta) {
    await delay();

    const index = consultasMock.findIndex((c) => c.numero === idConsulta);
    if (index === -1) {
      throw new Error(`Consulta '${idConsulta}' inexistente.`);
    }

    if (
      consultasMock[index].situacao !==
      STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO
    ) {
      throw new Error(
        "Só é possível desfazer enquanto a consulta estiver cancelada por não comparecimento.",
      );
    }

    consultasMock[index] = {
      ...consultasMock[index],
      motivoCancelamento: undefined,
      situacao: STATUS_CONSULTA.MARCADA,
    };
  },
};
