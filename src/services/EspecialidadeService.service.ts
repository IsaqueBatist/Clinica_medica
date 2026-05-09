import { especialidadesMock } from "../mocks";
import { STATUS_ENTIDADE } from "../constants/pessoa";
import { Especialidade } from "../types/models/especialidade.type";
import { ServicoEspecialidade } from "../types/services/EspecialidadeService.service.type";
import { delay } from "../utils/delay";

export const servicoEspecialidade: ServicoEspecialidade = {
  async listar() {
    await delay();
    return especialidadesMock.map((e) => ({ ...e }));
  },

  async pegarPorCodigo(codigoEspecialidade) {
    await delay();

    const especialidade = especialidadesMock.find(
      (e) => e.codigo === codigoEspecialidade,
    );
    if (!especialidade) throw new Error("Especialidade não encontrada");

    return { ...especialidade };
  },

  async desativar(codigoEspecialidade) {
    await delay();

    const index = especialidadesMock.findIndex(
      (e) => e.codigo === codigoEspecialidade,
    );
    if (index === -1) {
      throw new Error(
        `Falha na desativação: Especialidade '${codigoEspecialidade}' inexistente.`,
      );
    }

    especialidadesMock[index].status = STATUS_ENTIDADE.INATIVO;
  },

  async editar(codigoEspecialidade, data) {
    await delay();

    const index = especialidadesMock.findIndex(
      (e) => e.codigo === codigoEspecialidade,
    );
    if (index === -1) {
      throw new Error(
        `Falha na atualização: Especialidade '${codigoEspecialidade}' inexistente.`,
      );
    }

    const atualizada: Especialidade = {
      ...especialidadesMock[index],
      ...data,
    };
    especialidadesMock[index] = atualizada;
  },
};
