import { useContext } from "react";
import {
  ContextoEspecialidade,
  ValorContextoEspecialidade,
} from "../contexts/ContextoEspecialidade";

export function useContextoEspecialidade(): ValorContextoEspecialidade {
  const ctx = useContext(ContextoEspecialidade);
  if (!ctx) {
    throw new Error(
      "useContextoEspecialidade precisa ser usado dentro de <ProvedorEspecialidade>.",
    );
  }

  return ctx;
}
