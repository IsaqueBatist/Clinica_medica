import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Cliente } from "../types/models/cliente.type";
import {
  CadastrarClienteDTO,
  EditarClienteDTO,
} from "../types/services/ClienteService.service.type";
import { servicoCliente } from "../services";

interface EstadoCliente {
  items: Cliente[];
  loading: boolean;
  error: string | null;
}

const estadoInicial: EstadoCliente = {
  items: [],
  loading: false,
  error: null,
};

type AcaoCliente =
  | { type: "CARREGAMENTO_INICIAR" }
  | { type: "CARREGAMENTO_SUCESSO"; payload: Cliente[] }
  | { type: "CARREGAMENTO_ERRO"; payload: string }
  | { type: "CRIAR"; payload: Cliente }
  | { type: "EDITAR"; payload: Cliente }
  | { type: "DESATIVAR"; payload: string };

export interface ValorContextoCliente {
  state: EstadoCliente;
  criarCliente: (dto: CadastrarClienteDTO) => Promise<void>;
  atualizarCliente: (
    identificacao: string,
    dto: EditarClienteDTO,
  ) => Promise<void>;
  desativarCliente: (identificacao: string) => Promise<void>;
}

function reducerCliente(
  estado: EstadoCliente,
  acao: AcaoCliente,
): EstadoCliente {
  switch (acao.type) {
    case "CARREGAMENTO_INICIAR":
      return { ...estado, loading: true, error: null };
    case "CARREGAMENTO_SUCESSO":
      return { items: acao.payload, loading: false, error: null };
    case "CARREGAMENTO_ERRO":
      return { ...estado, loading: false, error: acao.payload };
    case "CRIAR":
      return { ...estado, items: [...estado.items, acao.payload] };
    case "EDITAR":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.identificacao === acao.payload.identificacao ? acao.payload : c,
        ),
      };
    case "DESATIVAR":
      return {
        ...estado,
        items: estado.items.map((c) =>
          c.identificacao === acao.payload ? { ...c, status: "inativo" } : c,
        ),
      };
    default: {
      const exausto: never = acao;
      return exausto;
    }
  }
}

export const ContextoCliente = createContext<ValorContextoCliente | null>(null);

interface PropsProvedorCliente {
  children: ReactNode;
}

export function ProvedorCliente({ children }: PropsProvedorCliente) {
  const [state, dispatch] = useReducer(reducerCliente, estadoInicial);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      dispatch({ type: "CARREGAMENTO_INICIAR" });
      try {
        const resultado = await servicoCliente.listar({}, 1, 1000);
        if (cancelado) return;
        dispatch({ type: "CARREGAMENTO_SUCESSO", payload: resultado.data });
      } catch (e) {
        if (cancelado) return;
        const msg = e instanceof Error ? e.message : "Erro ao listar clientes";
        dispatch({ type: "CARREGAMENTO_ERRO", payload: msg });
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  const criarCliente = useCallback(async (dto: CadastrarClienteDTO) => {
    const novo = await servicoCliente.cadastrar(dto);
    dispatch({ type: "CRIAR", payload: novo });
  }, []);

  const atualizarCliente = useCallback(
    async (identificacao: string, dto: EditarClienteDTO) => {
      const atualizado = await servicoCliente.editar(identificacao, dto);
      dispatch({ type: "EDITAR", payload: atualizado });
    },
    [],
  );

  const desativarCliente = useCallback(async (identificacao: string) => {
    await servicoCliente.desativar(identificacao);
    dispatch({ type: "DESATIVAR", payload: identificacao });
  }, []);

  const valor = useMemo<ValorContextoCliente>(
    () => ({ state, criarCliente, atualizarCliente, desativarCliente }),
    [state, criarCliente, atualizarCliente, desativarCliente],
  );

  return (
    <ContextoCliente.Provider value={valor}>
      {children}
    </ContextoCliente.Provider>
  );
}
