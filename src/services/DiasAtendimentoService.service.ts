import { medicosMock } from "../mocks";
import { DiasAtendimento } from "../types/models/diasAtendimento.type";
import { DiasAtendimentoService } from "../types/services/DiasAtendimentoService.service.type";
import { delay } from "../utils/delay";

let proximoSequencial = 100;

export const servicoDiasAtendimento: DiasAtendimentoService = {
  async listar(identificacaoMedico) {
    await delay();

    const medico = medicosMock.find((m) => m.matricula === identificacaoMedico);
    if (!medico) {
      throw new Error(`Médico '${identificacaoMedico}' inexistente.`);
    }

    return (medico.diasAtendimento ?? []).map((d) => ({ ...d }));
  },

  async registrar(data) {
    await delay();

    if (!data.medico) {
      throw new Error(
        "Falha no registro: médico é obrigatório para vincular o dia de atendimento.",
      );
    }

    const medico = medicosMock.find(
      (m) => m.matricula === data.medico!.matricula,
    );
    if (!medico) {
      throw new Error(
        `Falha no registro: Médico '${data.medico.matricula}' inexistente.`,
      );
    }

    const novoDia: DiasAtendimento = {
      identificacao: `DA-${++proximoSequencial}`,
      ...data,
    };

    medico.diasAtendimento = [...(medico.diasAtendimento ?? []), novoDia];

    return { ...novoDia };
  },

  async editar(identificacao, data) {
    await delay();

    for (const medico of medicosMock) {
      const dias = medico.diasAtendimento;
      if (!dias) continue;

      const index = dias.findIndex((d) => d.identificacao === identificacao);
      if (index === -1) continue;

      dias[index] = { ...dias[index], ...data };
      return { ...dias[index] };
    }

    throw new Error(
      `Falha na atualização: Dia de atendimento '${identificacao}' inexistente.`,
    );
  },

  async excluir(identificacao) {
    await delay();

    for (const medico of medicosMock) {
      const dias = medico.diasAtendimento;
      if (!dias) continue;

      const index = dias.findIndex((d) => d.identificacao === identificacao);
      if (index === -1) continue;

      dias.splice(index, 1);
      return;
    }

    throw new Error(
      `Falha na exclusão: Dia de atendimento '${identificacao}' inexistente.`,
    );
  },
};
