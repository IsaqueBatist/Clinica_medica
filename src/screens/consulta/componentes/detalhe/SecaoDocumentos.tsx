import React from "react";
import { View } from "react-native";
import { useTema } from "../../../../hooks/useTema";
import { Texto, Card, Icone } from "../../../../components/ui";

interface Props {
  laudo?: string;
  receita?: string;
}

export function SecaoDocumentos({ laudo, receita }: Props) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Documentos
      </Texto>

      <View style={{ gap: tema.espacamento.sm }}>
        {laudo && (
          <Card preenchimento="md">
            <View style={{ gap: tema.espacamento.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tema.espacamento.sm,
                }}
              >
                <Icone nome="info" tamanho={16} cor="texto.suave" />
                <Texto variante="legenda" cor="texto.suave">
                  Laudo
                </Texto>
              </View>
              <Texto variante="corpo">{laudo}</Texto>
            </View>
          </Card>
        )}

        {receita && (
          <Card preenchimento="md">
            <View style={{ gap: tema.espacamento.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tema.espacamento.sm,
                }}
              >
                <Icone nome="info" tamanho={16} cor="texto.suave" />
                <Texto variante="legenda" cor="texto.suave">
                  Receita
                </Texto>
              </View>
              <Texto variante="corpo">{receita}</Texto>
            </View>
          </Card>
        )}
      </View>
    </View>
  );
}
