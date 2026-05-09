import { useMemo } from "react";

import { STATUS_CONSULTA } from "../constants/consulta";
import { canTransition } from "../utils/consultaStateMachine";
import { useContextoConsulta } from "./useContextoConsulta";

function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Consultas no dia corrente cujo estado permite transição para
 * "cancelada pelo cliente" — elegibilidade derivada da state machine.
 */
export function useConsultasParaCancelarPeloCliente() {
  const {
    state: { items },
  } = useContextoConsulta();

  return useMemo(() => {
    const agora = new Date();
    return items
      .filter(
        (c) =>
          canTransition(c.situacao, STATUS_CONSULTA.CANCELADA_PELO_CLIENTE) &&
          mesmoDia(c.dataHora, agora),
      )
      .sort((a, b) => {
        const t = a.dataHora.getTime() - b.dataHora.getTime();
        if (t !== 0) return t;
        return a.medico.nome.localeCompare(b.medico.nome, "pt-BR");
      });
  }, [items]);
}
