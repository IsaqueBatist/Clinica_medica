  import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";

  export interface FabContextData {
    visible: boolean;
    show: () => void;
    hide: () => void;
  }

  const FabContext = createContext<FabContextData | undefined>(undefined);

  export function ProvedorFab({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);

    const show = useCallback(() => setVisible(true), []);
    const hide = useCallback(() => setVisible(false), []);

    const valor = useMemo(() => ({ visible, show, hide }), [visible, show, hide]);

    return <FabContext.Provider value={valor}>{children}</FabContext.Provider>;
  }

  export function useFab() {
    const context = useContext(FabContext);
    if (!context) {
      throw new Error("useFab deve ser usado dentro de um ProvedorFab");
    }
    return context;
  }