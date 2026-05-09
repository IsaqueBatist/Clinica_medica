import { useMemo } from "react";

import { STATUS_CONSULTA } from "../constants/consulta";
import { useContextoConsulta } from "./useContextoConsulta";

function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Consultas Marcadas no dia corrente, ordenadas por horário e nome do médico.
 */
export function useConsultasParaConfirmar() {
  const {
    state: { items },
  } = useContextoConsulta();

  return useMemo(() => {
    const agora = new Date();
    return items
      .filter(
        (c) =>
          c.situacao === STATUS_CONSULTA.MARCADA && mesmoDia(c.dataHora, agora),
      )
      .sort((a, b) => {
        const t = a.dataHora.getTime() - b.dataHora.getTime();
        if (t !== 0) return t;
        return a.medico.nome.localeCompare(b.medico.nome, "pt-BR");
      });
  }, [items]);
}
