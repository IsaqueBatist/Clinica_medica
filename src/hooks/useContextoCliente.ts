import { useContext } from "react";
import {
  ContextoCliente,
  ValorContextoCliente,
} from "../contexts/ContextoCliente";

export function useContextoCliente(): ValorContextoCliente {
  const ctx = useContext(ContextoCliente);
  if (!ctx) {
    throw new Error(
      "useContextoCliente precisa ser usado dentro de <ProvedorCliente>.",
    );
  }

  return ctx;
}
