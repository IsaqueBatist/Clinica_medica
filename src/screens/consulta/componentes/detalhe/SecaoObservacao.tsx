import React from "react";
import { View } from "react-native";
import { useTema } from "../../../../hooks/useTema";
import { Texto, Card, Icone } from "../../../../components/ui";

interface Props {
  observacao: string;
}

export function SecaoObservacao({ observacao }: Props) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Observação
      </Texto>

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
              Nota interna
            </Texto>
          </View>
          <Texto variante="corpo">{observacao}</Texto>
        </View>
      </Card>
    </View>
  );
}
