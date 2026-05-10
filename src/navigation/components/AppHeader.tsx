import React from "react";
import { View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";

import { useTema } from "../../hooks";
import { BotaoIcone } from "../../components/ui/BotaoIcone/BotaoIcone";
import { Texto } from "../../components/ui/Texto/Texto";
import { Avatar } from "../../components";
import { useContextoAuth } from "../../contexts/ContextoAuth";

/**
 * AppHeader — header customizado injetado em todos os Stacks via
 * `screenOptions.header`. Substitui o header default do react-navigation.
 *
 * Para título dinâmico (telas de detalhe), a tela chama
 * `navigation.setOptions({ title: cliente.nome })` num useEffect quando os
 * dados carregam. Como lemos `options.title`, o header re-renderiza sozinho.
 */
export function AppHeader(props: NativeStackHeaderProps) {
  const titulo = props.options.title ?? props.route.name;
  const { tema } = useTema();
  const { usuario } = useContextoAuth();
  const { top } = useSafeAreaInsets();

  function abrir() {
    props.navigation.dispatch(DrawerActions.openDrawer());
  }

  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor: tema.cores.fundo.superficie,
        borderBottomWidth: 1,
        borderBottomColor: tema.cores.borda.padrao,
      }}
    >
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: tema.espacamento.sm,
          gap: tema.espacamento.sm,
        }}
      >
        <BotaoIcone
          nomeIcone="menu"
          rotuloAcessivel="Abrir menu"
          variante="neutro"
          onPress={abrir}
        />
        <Texto
          variante="corpo"
          peso="negrito"
          style={{ flex: 1 }}
          numberOfLines={1}
        >
          {titulo}
        </Texto>
        {usuario && <Avatar nome={usuario?.nome} />}
      </View>
    </View>
  );
}
