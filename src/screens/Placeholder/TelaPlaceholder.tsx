import React from "react";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";

import { useTema } from "../../hooks/useTema";
import { Texto } from "../../components/ui/Texto";
import { MarcaApp } from "../../components/ui/MarcaApp";

/**
 * TelaPlaceholder — usada por todos os destinos enquanto as telas reais não
 * foram implementadas. Substitua cada uso pelo seu componente real à medida
 * que as features forem aterrissando.
 *
 * Não desenha header próprio — quem cuida disso é o `AppHeader` aplicado pelo
 * Stack via `screenOptions.header` (ver `src/navigation/stacks/*.tsx`).
 */
export function TelaPlaceholder() {
  const { tema } = useTema();
  const route = useRoute();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        alignItems: "center",
        justifyContent: "center",
        gap: tema.espacamento.lg,
        padding: tema.espacamento.xl,
      }}
    >
      <MarcaApp tamanho={64} />
      <Texto variante="h2" peso="negrito" alinhamento="center">
        {route.name}
      </Texto>
      <Texto variante="corpo" cor="texto.secundario" alinhamento="center">
        Tela ainda não implementada. Será preenchida pela feature desta seção.
      </Texto>
    </View>
  );
}
