import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { Texto } from "../../ui/Texto";
import { BotaoIcone } from "../../ui/BotaoIcone";

/**
 * Sidebar — painel lateral de navegação. Renderiza o conteúdo do menu (grupo
 * → item). Não controla visibilidade nem overlay — isso é responsabilidade
 * do consumidor (ver `SidebarDrawer` para o caso mais comum em mobile).
 *
 * Decisão: removido o "rail mode" (modo colapsado mostrando só ícones). Em
 * mobile o sidebar fica escondido por padrão e abre via drawer; em desktop
 * basta renderizar este componente direto numa coluna fixa. Manter dois
 * modos (rail + drawer) duplicava complexidade sem caso de uso real.
 *
 * `aoFechar`: quando passado, exibe um X no cabeçalho. Use em modo drawer.
 */

export interface ItemSidebar {
  chave: string;
  rotulo: string;
  icone?: NomeIcone;
}

export interface GrupoSidebar {
  chave: string;
  rotulo: string;
  icone: NomeIcone;
  itens: ItemSidebar[];
}

export interface PropsSidebar {
  grupos: GrupoSidebar[];
  chaveAtiva?: string;
  aoSelecionar: (chave: string) => void;
  /** Conteúdo opcional no topo (ex: logo + nome). */
  cabecalho?: React.ReactNode;
  /** Conteúdo opcional no rodapé (ex: usuário + sair). */
  rodape?: React.ReactNode;
  /** Quando passado, mostra um botão X no cabeçalho que dispara este callback. */
  aoFechar?: () => void;
}

export const LARGURA_SIDEBAR = 280;

export function Sidebar({
  grupos,
  chaveAtiva,
  aoSelecionar,
  cabecalho,
  rodape,
  aoFechar,
}: PropsSidebar) {
  const { tema } = useTema();
  // grupos abertos quando expandidos. Default: todos abertos.
  const [abertos, setAbertos] = useState<Record<string, boolean>>(
    () => Object.fromEntries(grupos.map((g) => [g.chave, true])),
  );

  const alternarGrupo = (chave: string) =>
    setAbertos((s) => ({ ...s, [chave]: !s[chave] }));

  return (
    <View
      style={{
        width: LARGURA_SIDEBAR,
        flex: 1,
        backgroundColor: tema.cores.fundo.superficie,
        borderRightWidth: 1,
        borderRightColor: tema.cores.borda.padrao,
      }}
    >
      {/* Cabeçalho */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: tema.espacamento.md,
          paddingVertical: tema.espacamento.lg,
          gap: tema.espacamento.sm,
        }}
      >
        <View style={{ flex: 1 }}>{cabecalho}</View>
        {aoFechar && (
          <BotaoIcone
            nomeIcone="fechar"
            rotuloAcessivel="Fechar menu"
            variante="neutro"
            tamanho={18}
            onPress={aoFechar}
          />
        )}
      </View>

      {/* Grupos */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tema.espacamento.sm,
          paddingBottom: tema.espacamento.lg,
          gap: tema.espacamento.sm,
        }}
      >
        {grupos.map((grupo) => {
          const aberto = !!abertos[grupo.chave];
          const algumFilhoAtivo = grupo.itens.some(
            (i) => i.chave === chaveAtiva,
          );
          return (
            <View key={grupo.chave}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={grupo.rotulo}
                accessibilityState={{ expanded: aberto }}
                onPress={() => alternarGrupo(grupo.chave)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: tema.espacamento.sm,
                  paddingVertical: tema.espacamento.sm,
                  gap: tema.espacamento.sm,
                  borderRadius: tema.raios.md,
                }}
              >
                <Icone
                  nome={grupo.icone}
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
                    algumFilhoAtivo
                      ? "marca.primario"
                      : "texto.secundario"
                  }
                >
                  {grupo.rotulo}
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
                    paddingLeft: tema.espacamento.xl,
                    gap: 2,
                    marginTop: tema.espacamento.xs,
                  }}
                >
                  {grupo.itens.map((item) => {
                    const ativo = item.chave === chaveAtiva;
                    return (
                      <Pressable
                        key={item.chave}
                        accessibilityRole="menuitem"
                        accessibilityState={{ selected: ativo }}
                        onPress={() => aoSelecionar(item.chave)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: tema.espacamento.sm,
                          paddingHorizontal: tema.espacamento.sm,
                          paddingVertical: tema.espacamento.sm,
                          borderRadius: tema.raios.md,
                          backgroundColor: ativo
                            ? tema.cores.fundo.suave
                            : "transparent",
                          borderLeftWidth: 2,
                          borderLeftColor: ativo
                            ? tema.cores.marca.secundario
                            : "transparent",
                        }}
                      >
                        {item.icone && (
                          <Icone
                            nome={item.icone}
                            tamanho={16}
                            cor={
                              ativo
                                ? tema.cores.marca.primario
                                : tema.cores.texto.suave
                            }
                          />
                        )}
                        <Texto
                          variante="corpo"
                          peso={ativo ? "medio" : "regular"}
                          cor={ativo ? "marca.primario" : "texto.secundario"}
                        >
                          {item.rotulo}
                        </Texto>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Rodapé */}
      {rodape && (
        <View
          style={{
            padding: tema.espacamento.md,
            borderTopWidth: 1,
            borderTopColor: tema.cores.borda.padrao,
          }}
        >
          {rodape}
        </View>
      )}
    </View>
  );
}
