import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone } from "../Icone";
import { Texto } from "../Texto";

/**
 * CampoFormulario — wrapper que padroniza a tríade label / controle / mensagem
 * de erro ou ajuda. Os controles (EntradaTexto, EntradaSelect, EntradaData)
 * ficam visualmente neutros sozinhos, mas plugados aqui ganham contexto.
 *
 * Regra: se `erro` é truthy, ele tem precedência sobre `ajuda` na exibição.
 */

export interface PropsCampoFormulario {
  rotulo?: string;
  obrigatorio?: boolean;
  ajuda?: string;
  erro?: string;
  children: React.ReactNode;
}

export function CampoFormulario({
  rotulo,
  obrigatorio = false,
  ajuda,
  erro,
  children,
}: PropsCampoFormulario) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.xs }}>
      {rotulo && (
        <View style={{ flexDirection: "row", gap: tema.espacamento.xs }}>
          <Texto variante="legenda" peso="medio" cor="texto.secundario">
            {rotulo}
          </Texto>
          {obrigatorio && (
            <Texto variante="legenda" peso="medio" cor="status.erro">
              *
            </Texto>
          )}
        </View>
      )}
      {children}
      {erro ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: tema.espacamento.xs }}
        >
          <Icone nome="aviso" tamanho={14} cor="status.erro" />
          <Texto variante="legenda" cor="status.erro">
            {erro}
          </Texto>
        </View>
      ) : ajuda ? (
        <Texto variante="legenda" cor="texto.suave">
          {ajuda}
        </Texto>
      ) : null}
    </View>
  );
}
