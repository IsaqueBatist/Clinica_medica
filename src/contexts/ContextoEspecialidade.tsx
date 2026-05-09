import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Especialidade } from "../types/models/especialidade.type";
import { EditarEspecialidadeDTO } from "../types/services/EspecialidadeService.service.type";
import { servicoEspecialidade } from "../services";

interface EstadoEspecialidade {
  items: Especialidade[];
  loading: boolean;
  error: string | null;
}

const estadoInicial: EstadoEspecialidade = {
  items: [],
  loading: false,
  error: null,
};

type AcaoEspecialidade =
  | { type: "CARREGAMENTO_INICIAR" }
  | { type: "CARREGAMENTO_SUCESSO"; payload: Especialidade[] }
  | { type: "CARREGAMENTO_ERRO"; payload: string }
  | { type: "EDITAR"; payload: Especialidade }
  | { type: "DESATIVAR"; payload: string };

export interface ValorContextoEspecialidade {
  state: EstadoEspecialidade;
  atualizarEspecialidade: (
    codigo: string,
    dto: EditarEspecialidadeDTO,
  ) => Promise<void>;
  desativarEspecialidade: (codigo: string) => Promise<void>;
}

function reducerEspecialidade(
  estado: EstadoEspecialidade,
  acao: AcaoEspecialidade,
): EstadoEspecialidade {
  switch (acao.type) {
    case "CARREGAMENTO_INICIAR":
      return { ...estado, loading: true, error: null };
    case "CARREGAMENTO_SUCESSO":
      return { items: acao.payload, loading: false, error: null };
    case "CARREGAMENTO_ERRO":
      return { ...estado, loading: false, error: acao.payload };
    case "EDITAR":
      return {
        ...estado,
        items: estado.items.map((e) =>
          e.codigo === acao.payload.codigo ? acao.payload : e,
        ),
      };
    case "DESATIVAR":
      return {
        ...estado,
        items: estado.items.map((e) =>
          e.codigo === acao.payload ? { ...e, status: "inativo" } : e,
        ),
      };
    default: {
      const exausto: never = acao;
      return exausto;
    }
  }
}

export const ContextoEspecialidade =
  createContext<ValorContextoEspecialidade | null>(null);

interface PropsProvedorEspecialidade {
  children: ReactNode;
}

export function ProvedorEspecialidade({
  children,
}: PropsProvedorEspecialidade) {
  const [state, dispatch] = useReducer(reducerEspecialidade, estadoInicial);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      dispatch({ type: "CARREGAMENTO_INICIAR" });
      try {
        const resultado = await servicoEspecialidade.listar();
        if (cancelado) return;
        dispatch({ type: "CARREGAMENTO_SUCESSO", payload: resultado });
      } catch (e) {
        if (cancelado) return;
        const msg =
          e instanceof Error ? e.message : "Erro ao listar especialidades";
        dispatch({ type: "CARREGAMENTO_ERRO", payload: msg });
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  // O service.editar retorna void; reconstruímos a entidade no provider
  // mesclando o estado anterior com o DTO para alimentar a action EDITAR.
  const atualizarEspecialidade = useCallback(
    async (codigo: string, dto: EditarEspecialidadeDTO) => {
      await servicoEspecialidade.editar(codigo, dto);
      dispatch({ type: "EDITAR", payload: { codigo, ...dto } });
    },
    [],
  );

  const desativarEspecialidade = useCallback(async (codigo: string) => {
    await servicoEspecialidade.desativar(codigo);
    dispatch({ type: "DESATIVAR", payload: codigo });
  }, []);

  const valor = useMemo<ValorContextoEspecialidade>(
    () => ({ state, atualizarEspecialidade, desativarEspecialidade }),
    [state, atualizarEspecialidade, desativarEspecialidade],
  );

  return (
    <ContextoEspecialidade.Provider value={valor}>
      {children}
    </ContextoEspecialidade.Provider>
  );
}
