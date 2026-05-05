import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { PaletaCores } from "../../../types/paletaCores.type";
import { Texto } from "../Texto";

/**
 * Badge — pílula compacta que pinta um label semântico (status). A cor de
 * fundo é uma versão suave do token de status (mistura com o branco/preto da
 * superfície via opacity), e o texto fica na cor sólida do mesmo status —
 * isso evita problemas de contraste ao usar o token cheio como background.
 */

export type VarianteBadge =
  | "sucesso"
  | "erro"
  | "aviso"
  | "info"
  | "neutro"
  | "marca";

export interface PropsBadge {
  variante?: VarianteBadge;
  children: React.ReactNode;
}

function corPara(
  variante: VarianteBadge,
  cores: PaletaCores,
): { fundo: string; texto: string } {
  switch (variante) {
    case "marca":
      return { fundo: cores.marca.primario, texto: cores.texto.sobreMarca };
    case "sucesso":
      return { fundo: cores.status.sucesso, texto: cores.texto.sobreMarca };
    case "erro":
      return { fundo: cores.status.erro, texto: cores.texto.sobreMarca };
    case "aviso":
      return { fundo: cores.status.aviso, texto: cores.texto.primario };
    case "info":
      return { fundo: cores.status.info, texto: cores.texto.sobreMarca };
    case "neutro":
    default:
      return { fundo: cores.fundo.suave, texto: cores.texto.secundario };
  }
}

export function Badge({ variante = "neutro", children }: PropsBadge) {
  const { tema } = useTema();
  const c = corPara(variante, tema.cores);
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: c.fundo,
        paddingHorizontal: tema.espacamento.sm,
        paddingVertical: tema.espacamento.xs,
        borderRadius: tema.raios.sm,
      }}
    >
      <Texto variante="legenda" peso="medio" style={{ color: c.texto }}>
        {children}
      </Texto>
    </View>
  );
}
