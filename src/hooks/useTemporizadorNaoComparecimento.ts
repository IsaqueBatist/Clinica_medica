import { useEffect, useRef } from "react";

import { STATUS_CONSULTA } from "../constants/consulta";
import { useContextoConsulta } from "./useContextoConsulta";
import { useToast } from "./useToast";

const INTERVALO_VERIFICACAO_MS = 30_000;
const GRACA_NAO_COMPARECIMENTO_MS = 0;
const DURACAO_TOAST_DESFAZER_MS = 10_000;

/**
 * Temporizador (ator do caso de uso) que cancela automaticamente consultas
 * Marcadas cuja hora já passou, marcando-as como "Cancelada por não
 * comparecimento". Para cada cancelamento dispara um toast com ação
 * "Desfazer", janela curta para o atendente reverter caso o cliente tenha
 * chegado atrasado.
 */
export function useTemporizadorNaoComparecimento() {
  const {
    state: { items },
    cancelarPorNaoComparecimento,
    desfazerNaoComparecimento,
  } = useContextoConsulta();
  const toast = useToast();

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const verificar = () => {
      const agora = Date.now();
      for (const consulta of itemsRef.current) {
        if (consulta.situacao !== STATUS_CONSULTA.MARCADA) continue;
        if (
          consulta.dataHora.getTime() + GRACA_NAO_COMPARECIMENTO_MS >
          agora
        ) {
          continue;
        }

        const numero = consulta.numero;
        const nomeCliente = consulta.cliente.nome;

        cancelarPorNaoComparecimento(numero)
          .then(() => {
            toast.exibir({
              variante: "aviso",
              titulo: "Não comparecimento registrado",
              descricao: `${nomeCliente} — atualizado pelo temporizador.`,
              duracaoMs: DURACAO_TOAST_DESFAZER_MS,
              acao: {
                rotulo: "Desfazer",
                aoPressionar: () => {
                  desfazerNaoComparecimento(numero).catch(() => {
                    /* desfazer só é válido enquanto consulta segue cancelada por não comparecimento */
                  });
                },
              },
            });
          })
          .catch(() => {
            /* race com transição manual concorrente — assertTransition rejeitou */
          });
      }
    };

    verificar();
    const id = setInterval(verificar, INTERVALO_VERIFICACAO_MS);
    return () => clearInterval(id);
  }, [cancelarPorNaoComparecimento, desfazerNaoComparecimento, toast]);
}
