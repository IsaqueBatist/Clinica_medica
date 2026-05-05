import React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { ChavePesoFonte, ChaveTamanhoFonte } from "../../../theme/typography";
import type { PaletaCores } from "../../../types/paletaCores.type";

/**
 * Texto — primitivo de tipografia.
 *
 * Centralizar tipografia num único componente garante que tamanho/peso/cor
 * venham sempre dos tokens. Componentes de domínio nunca devem usar `<Text>`
 * direto do RN para conteúdo estilizado — só via este wrapper.
 *
 * `cor` aceita um caminho semântico de PaletaCores ("texto.primario",
 * "marca.primario", "status.sucesso", ...) — assim o tema dark/light flui
 * automaticamente.
 */

type CorTema =
  | `texto.${keyof PaletaCores["texto"]}`
  | `marca.${keyof PaletaCores["marca"]}`
  | `status.${keyof PaletaCores["status"]}`;

export interface PropsTexto extends TextProps {
  variante?: ChaveTamanhoFonte;
  peso?: ChavePesoFonte;
  cor?: CorTema;
  alinhamento?: TextStyle["textAlign"];
}

function resolverCor(cores: PaletaCores, cor: CorTema): string {
  const [grupo, chave] = cor.split(".") as [keyof PaletaCores, string];
  return (cores[grupo] as Record<string, string>)[chave];
}

export function Texto({
  variante = "corpo",
  peso = "regular",
  cor = "texto.primario",
  alinhamento,
  style,
  children,
  ...rest
}: PropsTexto) {
  const { tema } = useTema();
  const { tipografia, cores } = tema;

  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: tipografia.tamanho[variante],
          lineHeight: tipografia.alturaLinha[variante],
          fontWeight: tipografia.peso[peso] as TextStyle["fontWeight"],
          color: resolverCor(cores, cor),
          textAlign: alinhamento,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
