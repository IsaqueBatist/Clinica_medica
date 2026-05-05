import React from "react";

import { Badge, type VarianteBadge } from "../../components/ui/Badge";
import {
  STATUS_CONSULTA_LABEL,
  type SituacaoConsulta,
} from "../../constants/consulta";
import {
  STATUS_CONSULTA_ROLE,
  type StatusRole,
} from "../../theme/statusColor";

/**
 * BadgeConsulta — recebe uma `SituacaoConsulta` (union completo de
 * STATUS_CONSULTA_LABEL) e renderiza o Badge com o variante correto.
 *
 * Decisão: o mapeamento canônico SituacaoConsulta → "papel semântico" vive
 * em `theme/statusColor.ts` (STATUS_CONSULTA_ROLE). Aqui só fechamos o
 * caminho papel → variante de Badge. Mudanças de UX (ex: "encerrada" deveria
 * ser sucesso?) são feitas naquele arquivo, sem tocar este componente.
 *
 * O union de domínio é exaustivo: TS reclama em build se um novo status for
 * adicionado e este mapping não cobrir.
 */

const ROLE_PARA_VARIANTE: Record<StatusRole, VarianteBadge> = {
  sucesso: "sucesso",
  erro: "erro",
  aviso: "aviso",
  info: "info",
  neutro: "neutro",
};

export interface PropsBadgeConsulta {
  status: SituacaoConsulta;
}

export function BadgeConsulta({ status }: PropsBadgeConsulta) {
  const variante = ROLE_PARA_VARIANTE[STATUS_CONSULTA_ROLE[status]];
  return <Badge variante={variante}>{STATUS_CONSULTA_LABEL[status]}</Badge>;
}

/** Helper puro — útil quando você precisa do variante mas não do JSX. */
export function varianteBadgeParaConsulta(
  status: SituacaoConsulta,
): VarianteBadge {
  return ROLE_PARA_VARIANTE[STATUS_CONSULTA_ROLE[status]];
}
