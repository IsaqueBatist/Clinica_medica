import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ToastViewport } from "../components/feedback/Toast/ToastViewport";

/**
 * Sistema de Toast.
 *
 * API pública é só `useToast()` (hook em `hooks/useToast.ts`). Este arquivo
 * mantém o context, o provider e a viewport (lista de toasts ativos).
 *
 * Decisão: stack é mantido em state aqui (não num store global) — facilita
 * SSR/teste e respeita o boundary do React. O `dismiss` é exposto para
 * uso programático (ex: fechar um toast quando outro fluxo termina).
 *
 * Auto-dismiss padrão: 4s para sucesso/info, 6s para aviso, 8s para erro
 * (o usuário precisa de mais tempo pra ler erros — seguindo Material).
 */

export type VarianteToast = "sucesso" | "erro" | "aviso" | "info";

export interface AcaoToast {
  rotulo: string;
  aoPressionar: () => void;
}

export interface Toast {
  id: string;
  variante: VarianteToast;
  titulo: string;
  descricao?: string;
  duracaoMs?: number;
  acao?: AcaoToast;
}

export interface ValorContextoToast {
  toasts: Toast[];
  exibir: (toast: Omit<Toast, "id">) => string;
  dispensar: (id: string) => void;
}

export const ContextoToast = createContext<ValorContextoToast | null>(null);

const DURACAO_PADRAO: Record<VarianteToast, number> = {
  sucesso: 4000,
  info: 4000,
  aviso: 6000,
  erro: 8000,
};

interface PropsProvedorToast {
  children: ReactNode;
}

export function ProvedorToast({ children }: PropsProvedorToast) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Mantemos ref dos timers ativos pra cancelar em unmount/dispense manual.
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dispensar = useCallback((id: string) => {
    const t = timers.current[id];
    if (t) {
      clearTimeout(t);
      delete timers.current[id];
    }
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
  }, []);

  const exibir = useCallback(
    (entrada: Omit<Toast, "id">) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duracao = entrada.duracaoMs ?? DURACAO_PADRAO[entrada.variante];
      const novo: Toast = { ...entrada, id };

      setToasts((atuais) => [...atuais, novo]);

      if (duracao > 0) {
        timers.current[id] = setTimeout(() => dispensar(id), duracao);
      }

      return id;
    },
    [dispensar],
  );

  const valor = useMemo<ValorContextoToast>(
    () => ({ toasts, exibir, dispensar }),
    [toasts, exibir, dispensar],
  );

  return (
    <ContextoToast.Provider value={valor}>
      {children}
      <ToastViewport toasts={toasts} aoFechar={dispensar} />
    </ContextoToast.Provider>
  );
}
