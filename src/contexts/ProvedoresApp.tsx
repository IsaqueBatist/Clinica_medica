import { ReactNode } from "react";

import { useTemporizadorNaoComparecimento } from "../hooks/useTemporizadorNaoComparecimento";
import { ProvedorCliente } from "./ContextoCliente";
import { ProvedorMedico } from "./ContextoMedico";
import { ProvedorEspecialidade } from "./ContextoEspecialidade";
import { ProvedorConsulta } from "./ContextoConsulta";
import { ProvedorAuth } from "./ContextoAuth";
import { ProvedorFab } from "./ContextoFab"

interface PropsProvedoresApp {
  children: ReactNode;
}

// Wrapper sem render — só monta o temporizador (ator do caso de uso)
// para ele ficar ativo enquanto o app autenticado estiver na árvore.
function MotorTemporizador() {
  useTemporizadorNaoComparecimento();
  return null;
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
    <ProvedorAuth>
      <ProvedorFab>
      <ProvedorEspecialidade>
        <ProvedorCliente>
          <ProvedorMedico>
            <ProvedorConsulta>
              <MotorTemporizador />
              {children}
            </ProvedorConsulta>
          </ProvedorMedico>
        </ProvedorCliente>
      </ProvedorEspecialidade>
      </ProvedorFab>
    </ProvedorAuth>
  );
}
