import { ReactNode } from "react";

import { ProvedorCliente } from "./ContextoCliente";
import { ProvedorMedico } from "./ContextoMedico";
import { ProvedorEspecialidade } from "./ContextoEspecialidade";
import { ProvedorConsulta } from "./ContextoConsulta";

interface PropsProvedoresApp {
  children: ReactNode;
}

/**
 * Composição dos providers de domínio.
 *
 * Ordem do aninhamento: do mais "raiz" pro mais "dependente".
 * - Especialidade é referência usada por Médico (cada médico tem uma).
 * - Médico e Cliente são referências usadas em Consulta.
 * Logo, Consulta fica por dentro pra que, no futuro, possa ler do
 * estado dos outros sem violar a regra de "Provider precisa estar acima".
 */
export function ProvedoresApp({ children }: PropsProvedoresApp) {
  return (
    <ProvedorEspecialidade>
      <ProvedorCliente>
        <ProvedorMedico>
          <ProvedorConsulta>{children}</ProvedorConsulta>
        </ProvedorMedico>
      </ProvedorCliente>
    </ProvedorEspecialidade>
  );
}
