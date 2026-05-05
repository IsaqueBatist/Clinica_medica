import { clientesMock } from "../mocks";
import { ServicoCliente } from "../types/services/ClienteService.service.type";
import { delay } from "../utils/delay";

export const servicoCliente: ServicoCliente = {
  async listar(filtros = {}, page = 1, limit = 1) {
    await delay();

    if (page < 1 || limit < 1) {
      throw new Error(
        "Parâmetros de paginação (page, limit) devem ser maiores que zero.",
      );
    }
    let filtrados = clientesMock;

    if (filtros.nome) {
      const termoBusca = filtros.nome.toLowerCase().trim();
      filtrados = filtrados.filter((c) =>
        c.nome.toLowerCase().includes(termoBusca),
      );
    }
    if (filtros.status) {
      filtrados = filtrados.filter((c) => c.status === filtros.status);
    }

    const total = filtrados.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const data = filtrados
      .slice(offset, offset + limit)
      .map((cliente) => ({ ...cliente }));

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
  async pegarPorIdentificao(identificacao) {
    await delay();

    const cliente = clientesMock.find(
      (cliente) => cliente.identificacao === identificacao,
    );

    if (!cliente) throw new Error("Cliente não encontrado");

    return cliente;
  },
  async desativar(identificacao) {
    await delay();
    const index = clientesMock.findIndex(
      (c) => c.identificacao === identificacao,
    );

    if (index === -1) {
      throw new Error(
        `Falha na desativação: Cliente com identificação '${identificacao}' inexistente.`,
      );
    }

    clientesMock[index].status = "inativo";
  },
  async cadastrar(data) {
    await delay();
    const proximoNumero = clientesMock.length + 1;
    const novaIdentificacao = `CLI${String(proximoNumero).padStart(3, "0")}`;
    
  },
};
