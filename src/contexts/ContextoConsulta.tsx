import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Consulta } from "../types/models/consulta.type";
import {
  CancelarConsultaDTO,
  EncerrarConsultaDTO,
  MarcarConsultaDTO,
  RealizarAtendimentoMedicoDTO,
} from "../types/services/ConsultaService.service.type";
import { servicoConsulta } from "../services";
import { STATUS_CONSULTA } from "../constants/consulta";

interface EstadoConsulta {
  items: Consulta[];
  loading: boolean;
  error: string | null;
}

const estadoInicial: EstadoConsulta = {
  items: [],
  loading: false,
  error: null,
};

// Modelagem das actions: cada transição do ciclo de vida da consulta vira
// uma action distinta. O reducer aplica o patch correto + situacao no item.
type AcaoConsulta =
  | { type: "CARREGAMENTO_INICIAR" }
  | { type: "CARREGAMENTO_SUCESSO"; payload: Consulta[] }
  | { type: "CARREGAMENTO_ERRO"; payload: string }
  | { type: "MARCAR"; payload: Consulta }
  | { type: "CONFIRMAR"; payload: { numero: string } }
  | {
      type: "REALIZAR";
      payload: { numero: string; dados: RealizarAtendimentoMedicoDTO };
    }
  | {
      type: "ENCERRAR";
      payload: { numero: string; dados: EncerrarConsultaDTO };
    }
  | {
      type: "CANCELAR_CLIENTE";
      payload: { numero: string; dados: CancelarConsultaDTO };
    }
  | {
      type: "CANCELAR_MEDICO";
      payload: { numero: string; dados: CancelarConsultaDTO };
    };

export interface ValorContextoConsulta {
  state: EstadoConsulta;
  marcarConsulta: (dto: MarcarConsultaDTO) => Promise<void>;
  confirmarConsulta: (numero: string) => Promise<void>;
  realizarConsulta: (
    numero: string,
    dto: RealizarAtendimentoMedicoDTO,
  ) => Promise<void>;
  encerrarConsulta: (numero: string, dto: EncerrarConsultaDTO) => Promise<void>;
  cancelarConsultaPeloCliente: (
    numero: string,
    dto: CancelarConsultaDTO,
  ) => Promise<void>;
  cancelarConsultaPeloMedico: (
    numero: string,
    dto: CancelarConsultaDTO,
  ) => Promise<void>;
}

function reducerConsulta(
  estado: EstadoConsulta,
  acao: AcaoConsulta,
): EstadoConsulta {
  switch (acao.type) {
    case "CARREGAMENTO_INICIAR":
      return { ...estado, loading: true, error: null };
    case "CARREGAMENTO_SUCESSO":
      return { items: acao.payload, loading: false, error: null };
    case "CARREGAMENTO_ERRO":
      return { ...estado, loading: false, error: acao.payload };

    case "MARCAR":
      return { ...estado, items: [...estado.items, acao.payload] };

    case "CONFIRMAR":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.numero === acao.payload.numero
            ? { ...c, situacao: STATUS_CONSULTA.CONFIRMADA }
            : c,
        ),
      };

    case "REALIZAR":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.numero === acao.payload.numero
            ? {
                ...c,
                ...acao.payload.dados,
                situacao: STATUS_CONSULTA.REALIZADA,
              }
            : c,
        ),
      };

    case "ENCERRAR":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.numero === acao.payload.numero
            ? {
                ...c,
                ...acao.payload.dados,
                situacao: STATUS_CONSULTA.ENCERRADA,
              }
            : c,
        ),
      };

    case "CANCELAR_CLIENTE":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.numero === acao.payload.numero
            ? {
                ...c,
                ...acao.payload.dados,
                situacao: STATUS_CONSULTA.CANCELADA_PELO_CLIENTE,
              }
            : c,
        ),
      };

    case "CANCELAR_MEDICO":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.numero === acao.payload.numero
            ? {
                ...c,
                ...acao.payload.dados,
                situacao: STATUS_CONSULTA.CANCELADA_PELO_MEDICO,
              }
            : c,
        ),
      };

    default: {
      const exausto: never = acao;
      return exausto;
    }
  }
}

export const ContextoConsulta = createContext<ValorContextoConsulta | null>(
  null,
);

interface PropsProvedorConsulta {
  children: ReactNode;
}

export function ProvedorConsulta({ children }: PropsProvedorConsulta) {
  const [state, dispatch] = useReducer(reducerConsulta, estadoInicial);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      dispatch({ type: "CARREGAMENTO_INICIAR" });
      try {
        const resultado = await servicoConsulta.listar({}, 1, 1000);
        if (cancelado) return;
        dispatch({ type: "CARREGAMENTO_SUCESSO", payload: resultado.data });
      } catch (e) {
        if (cancelado) return;
        const msg = e instanceof Error ? e.message : "Erro ao listar consultas";
        dispatch({ type: "CARREGAMENTO_ERRO", payload: msg });
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  const marcarConsulta = useCallback(async (dto: MarcarConsultaDTO) => {
    const nova = await servicoConsulta.marcarConsulta(dto);
    dispatch({ type: "MARCAR", payload: nova });
  }, []);

  const confirmarConsulta = useCallback(async (numero: string) => {
    await servicoConsulta.confirmarConsulta(numero);
    dispatch({ type: "CONFIRMAR", payload: { numero } });
  }, []);

  const realizarConsulta = useCallback(
    async (numero: string, dto: RealizarAtendimentoMedicoDTO) => {
      await servicoConsulta.realizarConsulta(numero, dto);
      dispatch({ type: "REALIZAR", payload: { numero, dados: dto } });
    },
    [],
  );

  const encerrarConsulta = useCallback(
    async (numero: string, dto: EncerrarConsultaDTO) => {
      await servicoConsulta.encerrarConsulta(numero, dto);
      dispatch({ type: "ENCERRAR", payload: { numero, dados: dto } });
    },
    [],
  );

  const cancelarConsultaPeloCliente = useCallback(
    async (numero: string, dto: CancelarConsultaDTO) => {
      await servicoConsulta.cancelarConsulta(numero, dto);
      dispatch({ type: "CANCELAR_CLIENTE", payload: { numero, dados: dto } });
    },
    [],
  );

  const cancelarConsultaPeloMedico = useCallback(
    async (numero: string, dto: CancelarConsultaDTO) => {
      await servicoConsulta.cancelarConsultaMedico(numero, dto);
      dispatch({ type: "CANCELAR_MEDICO", payload: { numero, dados: dto } });
    },
    [],
  );

  const valor = useMemo<ValorContextoConsulta>(
    () => ({
      state,
      marcarConsulta,
      confirmarConsulta,
      realizarConsulta,
      encerrarConsulta,
      cancelarConsultaPeloCliente,
      cancelarConsultaPeloMedico,
    }),
    [
      state,
      marcarConsulta,
      confirmarConsulta,
      realizarConsulta,
      encerrarConsulta,
      cancelarConsultaPeloCliente,
      cancelarConsultaPeloMedico,
    ],
  );

  return (
    <ContextoConsulta.Provider value={valor}>
      {children}
    </ContextoConsulta.Provider>
  );
}
