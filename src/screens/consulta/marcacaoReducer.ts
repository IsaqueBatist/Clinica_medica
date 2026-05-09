import { WizardAction, WizardState, WizardStep } from "./marcacaoTypes";

export const ESTADO_INICIAL: WizardState = { step: "cliente" };

const ORDEM: WizardStep[] = ["cliente", "medico", "agenda", "resumo"];

export function reducerMarcacao(
  estado: WizardState,
  acao: WizardAction,
): WizardState {
  switch (acao.type) {
    case "SET_CLIENTE":
      return { ...estado, cliente: acao.payload, tipo: undefined };
    case "SET_MEDICO":
      const med = acao.payload;
      return {
        ...estado,
        medico: med,
        especialidade: med.especialidade,
        dataHora: undefined,
      };
    case "SET_SLOT":
      return { ...estado, dataHora: acao.payload };
    case "SET_TIPO":
      return { ...estado, tipo: acao.payload };
    case "AVANCAR": {
      const idx = ORDEM.indexOf(estado.step);
      const proximo = ORDEM[Math.min(idx + 1, ORDEM.length - 1)];
      return { ...estado, step: proximo };
    }
    case "VOLTAR":
      const idx = ORDEM.indexOf(estado.step);
      const anterior = ORDEM[Math.max(idx - 1, 0)];
      return limparAPartirDe({ ...estado, step: anterior }, anterior);
    case "RESET":
      return ESTADO_INICIAL;
  }
}

function limparAPartirDe(estado: WizardState, step: WizardStep): WizardState {
  switch (step) {
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

export function podeAvancar(estado: WizardState): boolean {
  switch (estado.step) {
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
