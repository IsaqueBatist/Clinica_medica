// SecaoProcedimentos.tsx
import React from "react";
import { View } from "react-native";
import { useTema } from "../../../../hooks/useTema";
import { Texto, Card, Icone } from "../../../../components/ui";
import type { Procedimento } from "../../../../constants/procedimentos";

interface Props {
  procedimentos: Procedimento[];
}

export function SecaoProcedimentos({ procedimentos }: Props) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Procedimentos
      </Texto>

      <Card preenchimento="md">
        <View style={{ gap: tema.espacamento.sm }}>
          {procedimentos.map((procedimento, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: tema.espacamento.md,
                paddingVertical: tema.espacamento.xs,
                borderBottomWidth: index < procedimentos.length - 1 ? 1 : 0,
                borderBottomColor: tema.cores.borda.padrao,
              }}
            >
              <Icone
                nome="check"
                tamanho={16}
                cor={tema.cores.status.sucesso}
              />
              <Texto variante="corpo">{procedimento}</Texto>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}
