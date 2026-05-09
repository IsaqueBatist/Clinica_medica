import { useContext } from "react";

import {
  ContextoToast,
  type ValorContextoToast,
} from "../contexts/ContextoToast";

/**
 * Hook para emitir toasts em qualquer lugar abaixo de `<ProvedorToast>`.
 *
 * @example
 *   const toast = useToast();
 *   toast.exibir({ variante: "sucesso", titulo: "Cliente cadastrado" });
 *
 * Lança erro se chamado fora do provider — fail loud em dev é melhor do que
 * um no-op silencioso.
 */
export function useToast(): ValorContextoToast {
  const ctx = useContext(ContextoToast);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ProvedorToast>");
  }
  return ctx;
}
