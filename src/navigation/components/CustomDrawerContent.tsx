import React, { useState } from "react";
import { Pressable, View } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";

import { useTema } from "../../hooks/useTema";
import { Icone, type NomeIcone } from "../../components/ui/Icone";
import { Texto } from "../../components/ui/Texto";
import { MarcaApp } from "../../components/ui/MarcaApp";
import { Botao } from "../../components/ui/Botao";
import { ENTRADAS_DRAWER, type DrawerParamList } from "../types";

/**
 * CustomDrawerContent — substitui o `DrawerItemList` padrão pelo nosso visual.
 *
 * Renderiza `ENTRADAS_DRAWER` em dois modos:
 *  - Item solto → linha clicável que navega.
 *  - Grupo → cabeçalho clicável com chevron + lista de subitens identada.
 *    Estado de expansão é local (`useState`) e persiste durante a sessão
 *    porque o componente não desmonta quando o drawer fecha.
 *
 * `aoSair` é injetado pelo `DrawerNavigator` via prop `drawerContent`. O Drawer
 * em si não conhece auth — a decisão fica no nível de cima (App).
 */
export interface PropsCustomDrawerContent extends DrawerContentComponentProps {
  aoSair?: () => void;
}

export function CustomDrawerContent({
  state,
  navigation,
  aoSair,
}: PropsCustomDrawerContent) {
  const { tema, modo, alternar } = useTema();
  const rotaAtiva = state.routes[state.index]?.name as keyof DrawerParamList;

  // Inicia com todos os grupos abertos. Mantemos em state para que, se o user
  // colapsar um grupo, a preferência persista até o app fechar.
  const [abertos, setAbertos] = useState<Record<string, boolean>>(() => {
    const inicial: Record<string, boolean> = {};
    for (const entrada of ENTRADAS_DRAWER) {
      if (entrada.tipo === "grupo") inicial[entrada.chave] = true;
    }
    return inicial;
  });

  const alternarGrupo = (chave: string) =>
    setAbertos((s) => ({ ...s, [chave]: !s[chave] }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.superficie,
      }}
    >
      <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: tema.espacamento.sm,
            paddingHorizontal: tema.espacamento.md,
            paddingVertical: tema.espacamento.lg,
          }}
        >
          <MarcaApp tamanho={32} />
          <Texto variante="corpo" peso="negrito">
            Clínica
          </Texto>
        </View>

        <View
          style={{
            paddingHorizontal: tema.espacamento.sm,
            gap: tema.espacamento.xs,
          }}
        >
          {ENTRADAS_DRAWER.map((entrada) => {
            if (entrada.tipo === "item") {
              const ativo = entrada.nome === rotaAtiva;
              return (
                <ItemNavegacao
                  key={entrada.nome}
                  rotulo={entrada.rotulo}
                  icone={entrada.icone}
                  ativo={ativo}
                  onPress={() => navigation.navigate(entrada.nome)}
                />
              );
            }

            const aberto = !!abertos[entrada.chave];
            const algumFilhoAtivo = entrada.itens.some(
              (i) => i.nome === rotaAtiva,
            );

            return (
              <View key={entrada.chave}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={entrada.rotulo}
                  accessibilityState={{ expanded: aberto }}
                  onPress={() => alternarGrupo(entrada.chave)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tema.espacamento.sm,
                    paddingHorizontal: tema.espacamento.md,
                    paddingVertical: tema.espacamento.md,
                    borderRadius: tema.raios.md,
                  }}
                >
                  <Icone
                    nome={entrada.icone}
                    tamanho={20}
                    cor={
                      algumFilhoAtivo
                        ? tema.cores.marca.primario
                        : tema.cores.texto.secundario
                    }
                  />
                  <Texto
                    variante="corpo"
                    peso="medio"
                    style={{ flex: 1 }}
                    cor={
                      algumFilhoAtivo ? "marca.primario" : "texto.secundario"
                    }
                  >
                    {entrada.rotulo}
                  </Texto>
                  <Icone
                    nome={aberto ? "chevronBaixo" : "chevronDireita"}
                    tamanho={14}
                    cor="texto.suave"
                  />
                </Pressable>

                {aberto && (
                  <View
                    style={{
                      paddingLeft: tema.espacamento.lg,
                      gap: 2,
                      marginTop: tema.espacamento.xs,
                      marginBottom: tema.espacamento.sm,
                    }}
                  >
                    {entrada.itens.map((subitem) => {
                      const ativo = subitem.nome === rotaAtiva;
                      return (
                        <ItemNavegacao
                          key={subitem.nome}
                          rotulo={subitem.rotulo}
                          icone={subitem.icone}
                          ativo={ativo}
                          onPress={() => navigation.navigate(subitem.nome)}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View
        style={{
          padding: tema.espacamento.md,
          borderTopWidth: 1,
          borderTopColor: tema.cores.borda.padrao,
          gap: tema.espacamento.sm,
        }}
      >
        <Botao
          rotulo={modo === "claro" ? "Modo escuro" : "Modo claro"}
          variante="fantasma"
          iconeEsquerda="tema"
          tamanho="sm"
          onPress={alternar}
        />
        {aoSair && (
          <Botao
            rotulo="Sair"
            variante="fantasma"
            iconeEsquerda="sair"
            tamanho="sm"
            onPress={aoSair}
          />
        )}
      </View>
    </View>
  );
}

interface PropsItemNavegacao {
  rotulo: string;
  icone?: NomeIcone;
  ativo: boolean;
  onPress: () => void;
}

function ItemNavegacao({ rotulo, icone, ativo, onPress }: PropsItemNavegacao) {
  const { tema } = useTema();
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected: ativo }}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: tema.espacamento.sm,
        paddingHorizontal: tema.espacamento.md,
        paddingVertical: tema.espacamento.sm,
        borderRadius: tema.raios.md,
        backgroundColor: ativo ? tema.cores.fundo.suave : "transparent",
        borderLeftWidth: 2,
        borderLeftColor: ativo
          ? tema.cores.marca.secundario
          : "transparent",
      }}
    >
      {icone && (
        <Icone
          nome={icone}
          tamanho={16}
          cor={
            ativo ? tema.cores.marca.primario : tema.cores.texto.suave
          }
        />
      )}
      <Texto
        variante="corpo"
        peso={ativo ? "medio" : "regular"}
        cor={ativo ? "marca.primario" : "texto.secundario"}
      >
        {rotulo}
      </Texto>
    </Pressable>
  );
}
