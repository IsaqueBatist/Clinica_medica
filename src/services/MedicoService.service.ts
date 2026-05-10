import { medicosMock } from "../mocks";
import { STATUS_ENTIDADE } from "../constants/pessoa";
import { Medico } from "../types/models/medico.type";
import { ServicoMedico } from "../types/services/MedicoService.service.type";
import { delay } from "../utils/delay";

export const servicoMedico: ServicoMedico = {
  async listar(filtro = {}, page = 1, limit = 10) {
    await delay();

    if (page < 1 || limit < 1) {
      throw new Error(
        "Parâmetros de paginação (page, limit) devem ser maiores que zero.",
      );
    }

    let filtrados = medicosMock;

    if (filtro.nome) {
      const termoBusca = filtro.nome.toLowerCase().trim();
      filtrados = filtrados.filter((m) =>
        m.nome.toLowerCase().includes(termoBusca),
      );
    }
    if (filtro.status) {
      filtrados = filtrados.filter((m) => m.status === filtro.status);
    }
    if (filtro.crm) {
      const termoBusca = filtro.crm.toLowerCase().trim();
      filtrados = filtrados.filter((m) =>
        m.crm.toLowerCase().includes(termoBusca),
      );
    }

    const total = filtrados.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const data = filtrados
      .slice(offset, offset + limit)
      .map((medico) => ({ ...medico }));

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

  async pegarPorIdentificacao(identificacao) {
    await delay();

    const medico = medicosMock.find((m) => m.matricula === identificacao);
    if (!medico) throw new Error("Médico não encontrado");

    return { ...medico };
  },

  async cadastrar(data) {
    await delay();

    const proximoNumero = medicosMock.length + 1;
    const novaMatricula = `MED${String(proximoNumero).padStart(3, "0")}`;

    const novoMedico: Medico = {
      matricula: novaMatricula,
      status: STATUS_ENTIDADE.ATIVO,
      ...data,
    };

    medicosMock.push(novoMedico);

    return { ...novoMedico };
  },

  async editar(identificacao, data) {
    await delay();

    const index = medicosMock.findIndex((m) => m.matricula === identificacao);
    if (index === -1) {
      throw new Error(
        `Falha na atualização: Médico com identificação '${identificacao}' inexistente.`,
      );
    }

    medicosMock[index] = {
      ...medicosMock[index],
      ...data,
    };

    return { ...medicosMock[index] };
  },

  async desativar(identificacao) {
    await delay();

    const index = medicosMock.findIndex((m) => m.matricula === identificacao);
    if (index === -1) {
      throw new Error(
        `Falha na desativação: Médico com identificação '${identificacao}' inexistente.`,
      );
    }

    medicosMock[index].status = STATUS_ENTIDADE.INATIVO;
  },
};
