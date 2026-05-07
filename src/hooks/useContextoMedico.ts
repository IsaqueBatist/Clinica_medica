import { useContext } from "react";
import {
  ContextoMedico,
  ValorContextoMedico,
} from "../contexts/ContextoMedico";

export function useContextoMedico(): ValorContextoMedico {
  const ctx = useContext(ContextoMedico);
  if (!ctx) {
    throw new Error(
      "useContextoMedico precisa ser usado dentro de <ProvedorMedico>.",
    );
  }

  return ctx;
}
