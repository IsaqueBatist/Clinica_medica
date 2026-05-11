import React from "react";
import { View } from "react-native";
import { useTema } from "../../../../hooks/useTema";
import { Texto, Card, Icone } from "../../../../components/ui";

interface Props {
  motivo: string;
}

export function SecaoCancelamento({ motivo }: Props) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Cancelamento
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
            <Icone nome="aviso" tamanho={16} cor={tema.cores.status.erro} />
            <Texto variante="legenda" cor="texto.suave">
              Motivo
            </Texto>
          </View>
          <Texto variante="corpo">{motivo}</Texto>
        </View>
      </Card>
    </View>
  );
}
