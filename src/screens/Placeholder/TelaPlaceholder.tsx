import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useTema } from "../../hooks/useTema";
import { BotaoIcone } from "../../components/ui/BotaoIcone";
import { Texto } from "../../components/ui/Texto";
import { MarcaApp } from "../../components/ui/MarcaApp";
import type { DrawerParamList } from "../../navigation/types";

/**
 * TelaPlaceholder — usada por todos os destinos do Drawer enquanto as telas
 * reais não foram implementadas (NAV-02 em diante). Substitua cada uso por
 * um Stack próprio à medida que as features forem aterrissando.
 *
 * Mostra um cabeçalho com hamburger (abre/fecha o drawer) e um corpo com o
 * nome da rota. É só andaime — não tem regra de domínio aqui.
 */
export function TelaPlaceholder() {
  const { tema } = useTema();
  const navigation =
    useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const route = useRoute();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={["top", "left", "right"]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          paddingVertical: tema.espacamento.sm,
          backgroundColor: tema.cores.fundo.superficie,
          borderBottomWidth: 1,
          borderBottomColor: tema.cores.borda.padrao,
        }}
      >
        <BotaoIcone
          nomeIcone="menu"
          rotuloAcessivel="Abrir menu"
          variante="neutro"
          tamanho={20}
          onPress={() => navigation.openDrawer()}
        />
        <Texto variante="corpo" peso="negrito" style={{ flex: 1 }}>
          {route.name}
        </Texto>
      </View>

      <View
        style={{
          flex: 1,
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
          Tela ainda não implementada. Será preenchida pelo Stack desta seção.
        </Texto>
      </View>
    </SafeAreaView>
  );
}
