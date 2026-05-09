import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Medico } from "../types/models/medico.type";
import {
  CadastrarMedicoDTO,
  EditarMedicoDTO,
} from "../types/services/MedicoService.service.type";
import { servicoMedico } from "../services";

interface EstadoMedico {
  items: Medico[];
  loading: boolean;
  error: string | null;
}

const estadoInicial: EstadoMedico = {
  items: [],
  loading: false,
  error: null,
};

type AcaoMedico =
  | { type: "CARREGAMENTO_INICIAR" }
  | { type: "CARREGAMENTO_SUCESSO"; payload: Medico[] }
  | { type: "CARREGAMENTO_ERRO"; payload: string }
  | { type: "CRIAR"; payload: Medico }
  | { type: "EDITAR"; payload: Medico }
  | { type: "DESATIVAR"; payload: string };

export interface ValorContextoMedico {
  state: EstadoMedico;
  criarMedico: (dto: CadastrarMedicoDTO) => Promise<void>;
  atualizarMedico: (matricula: string, dto: EditarMedicoDTO) => Promise<void>;
  desativarMedico: (matricula: string) => Promise<void>;
}

function reducerMedico(estado: EstadoMedico, acao: AcaoMedico): EstadoMedico {
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
        items: estado.items.map((m) =>
          m.matricula === acao.payload.matricula ? acao.payload : m,
        ),
      };
    case "DESATIVAR":
      return {
        ...estado,
        items: estado.items.map((m) =>
          m.matricula === acao.payload ? { ...m, status: "inativo" } : m,
        ),
      };
    default: {
      const exausto: never = acao;
      return exausto;
    }
  }
}

export const ContextoMedico = createContext<ValorContextoMedico | null>(null);

interface PropsProvedorMedico {
  children: ReactNode;
}

export function ProvedorMedico({ children }: PropsProvedorMedico) {
  const [state, dispatch] = useReducer(reducerMedico, estadoInicial);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      dispatch({ type: "CARREGAMENTO_INICIAR" });
      try {
        const resultado = await servicoMedico.listar({}, 1, 1000);
        if (cancelado) return;
        dispatch({ type: "CARREGAMENTO_SUCESSO", payload: resultado.data });
      } catch (e) {
        if (cancelado) return;
        const msg = e instanceof Error ? e.message : "Erro ao listar médicos";
        dispatch({ type: "CARREGAMENTO_ERRO", payload: msg });
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  const criarMedico = useCallback(async (dto: CadastrarMedicoDTO) => {
    const novo = await servicoMedico.cadastrar(dto);
    dispatch({ type: "CRIAR", payload: novo });
  }, []);

  const atualizarMedico = useCallback(
    async (matricula: string, dto: EditarMedicoDTO) => {
      const atualizado = await servicoMedico.editar(matricula, dto);
      dispatch({ type: "EDITAR", payload: atualizado });
    },
    [],
  );

  const desativarMedico = useCallback(async (matricula: string) => {
    await servicoMedico.desativar(matricula);
    dispatch({ type: "DESATIVAR", payload: matricula });
  }, []);

  const valor = useMemo<ValorContextoMedico>(
    () => ({ state, criarMedico, atualizarMedico, desativarMedico }),
    [state, criarMedico, atualizarMedico, desativarMedico],
  );

  return (
    <ContextoMedico.Provider value={valor}>{children}</ContextoMedico.Provider>
  );
}
