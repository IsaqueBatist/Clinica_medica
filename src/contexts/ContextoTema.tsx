import React, {
  createContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { coresClaras, coresEscuras } from "../theme/colors";
import { espacamento } from "../theme/spacing";
import { tipografia } from "../theme/typography";
import { raios } from "../theme/radii";
import type { Tema, ModoTema } from "../types/tema.type";

/**
 * Context interno. O hook `useTema` é a API pública — não exporte
 * `ContextoTema` diretamente para componentes.
 *
 * EXT-01 (futuro):
 *  - Persistir `modo` em storage (AsyncStorage/MMKV no RN, localStorage na web).
 *  - Detectar preferência do sistema operacional na primeira carga.
 *  - Expor uma terceira opção 'sistema' que segue o SO em runtime.
 *
 * Esta versão fica simples de propósito: state em memória, controlado por
 * `modoInicial`. Trocar a implementação não muda a API consumida pelos
 * componentes (`useTema()`).
 */

export interface ValorContextoTema {
  tema: Tema;
  modo: ModoTema;
  definirModo: (modo: ModoTema) => void;
  alternar: () => void;
}

export const ContextoTema = createContext<ValorContextoTema | null>(null);

interface PropsProvedorTema {
  children: ReactNode;
  /** Tema inicial. Padrão: 'claro'. */
  modoInicial?: ModoTema;
}

export function ProvedorTema({
  children,
  modoInicial = "claro",
}: PropsProvedorTema) {
  const [modo, definirModo] = useState<ModoTema>(modoInicial);

  const alternar = useCallback(() => {
    definirModo((anterior) => (anterior === "claro" ? "escuro" : "claro"));
  }, []);

  const value = useMemo<ValorContextoTema>(() => {
    const cores = modo === "escuro" ? coresEscuras : coresClaras;

    return {
      tema: { cores, espacamento, tipografia, raios },
      modo,
      definirModo,
      alternar,
    };
  }, [modo, alternar]);

  return (
    <ContextoTema.Provider value={value}>{children}</ContextoTema.Provider>
  );
}
