import { useContext } from "react";

import { ContextoTema, type ValorContextoTema } from "../contexts/ContextoTema";

/**
 * Hook para consumir o tema atual.
 *
 * Lança erro se chamado fora de `<ProvedorTema>`. Isso é intencional — falha
 * loud em dev evita bugs silenciosos onde o componente renderiza com
 * `undefined.cores`.
 *
 * @example
 * function Card({ children }: { children: ReactNode }) {
 *   const { tema } = useTema();
 *   return (
 *     <View style={{
 *       backgroundColor: tema.cores.fundo.superficie,
 *       padding: tema.espacamento.lg,
 *       borderRadius: tema.raios.lg,
 *     }}>
 *       {children}
 *     </View>
 *   );
 * }
 */
export function useTema(): ValorContextoTema {
  const ctx = useContext(ContextoTema);
  if (!ctx) {
    throw new Error("useTema deve ser usado dentro de <ProvedorTema>");
  }
  return ctx;
}
