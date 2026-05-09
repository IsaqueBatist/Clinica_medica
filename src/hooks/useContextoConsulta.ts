import { useContext } from "react";
import {
  ContextoConsulta,
  ValorContextoConsulta,
} from "../contexts/ContextoConsulta";

export function useContextoConsulta(): ValorContextoConsulta {
  const ctx = useContext(ContextoConsulta);
  if (!ctx) {
    throw new Error(
      "useContextoConsulta precisa ser usado dentro de <ProvedorConsulta>.",
    );
  }

  return ctx;
}
