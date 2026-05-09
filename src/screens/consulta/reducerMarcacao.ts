import { AcaoMarcacao, EstadoMarcacao, Etapa } from "./tiposMarcacao";

export const ESTADO_INICIAL: EstadoMarcacao = { etapa: "cliente" };

const ORDEM: Etapa[] = ["cliente", "medico", "agenda", "resumo"];

export function reducerMarcacao(
  estado: EstadoMarcacao,
  acao: AcaoMarcacao,
): EstadoMarcacao {
  switch (acao.type) {
    case "SET_CLIENTE":
      return { ...estado, cliente: acao.payload, tipo: undefined };
    case "SET_MEDICO": {
      const med = acao.payload;
      return {
        ...estado,
        medico: med,
        especialidade: med.especialidade,
        dataHora: undefined,
      };
    }
    case "SET_SLOT":
      return { ...estado, dataHora: acao.payload };
    case "SET_TIPO":
      return { ...estado, tipo: acao.payload };
    case "AVANCAR": {
      const idx = ORDEM.indexOf(estado.etapa);
      const proxima = ORDEM[Math.min(idx + 1, ORDEM.length - 1)];
      return { ...estado, etapa: proxima };
    }
    case "VOLTAR": {
      const idx = ORDEM.indexOf(estado.etapa);
      const anterior = ORDEM[Math.max(idx - 1, 0)];
      return limparAPartirDe({ ...estado, etapa: anterior }, anterior);
    }
    case "RESET":
      return ESTADO_INICIAL;
  }
}

function limparAPartirDe(estado: EstadoMarcacao, etapa: Etapa): EstadoMarcacao {
  switch (etapa) {
    case "cliente":
      return {
        ...estado,
        medico: undefined,
        especialidade: undefined,
        dataHora: undefined,
      };
    case "medico":
      return { ...estado, dataHora: undefined };
    default:
      return estado;
  }
}

export function podeAvancar(estado: EstadoMarcacao): boolean {
  switch (estado.etapa) {
    case "cliente":
      return !!estado.cliente;
    case "medico":
      return !!estado.medico;
    case "agenda":
      return !!estado.dataHora;
    case "resumo":
      return true;
  }
}
