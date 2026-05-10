  import React, { useRef, useEffect } from "react";
  import { Animated, Pressable, View } from "react-native";

  import { useTema } from "../../../hooks/useTema";
  import { Icone, type NomeIcone } from "../../ui/Icone";

  export interface ItemBarra {
    chave: string;
    icone: NomeIcone;
    rotuloAcessivel: string;
  }

  export interface PropsBarraInferior {
    itens: ItemBarra[];
    chaveAtiva: string;
    aoSelecionar: (chave: string) => void;
    larguraMaxima?: number;
  }

  export function BarraInferior({
    itens,
    chaveAtiva,
    aoSelecionar,
    larguraMaxima = 360,
  }: PropsBarraInferior) {
    const { tema } = useTema();

    return (
      <View
        style={{
          alignItems: "center",
          paddingBottom: tema.espacamento.lg,
          paddingHorizontal: tema.espacamento.lg,
        }}
      >
        <View
          accessibilityRole="tablist"
          style={{
            width: "100%",
            maxWidth: larguraMaxima,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: tema.cores.fundo.superficie,
            borderRadius: tema.raios.completo,
            paddingHorizontal: tema.espacamento.sm,
            paddingVertical: tema.espacamento.sm,
            borderWidth: 1,
            borderColor: tema.cores.borda.padrao,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {itens.map((item) => {
            const ativo = item.chave === chaveAtiva;
            return (
              <ItemBarraPressable
                key={item.chave}
                ativo={ativo}
                item={item}
                aoPressionar={() => aoSelecionar(item.chave)}
              />
            );
          })}
        </View>
      </View>
    );
  }

  interface PropsItemPressable {
    item: ItemBarra;
    ativo: boolean;
    aoPressionar: () => void;
  }

  function ItemBarraPressable({ item, ativo, aoPressionar }: PropsItemPressable) {
    const { tema } = useTema();
    const escala = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.spring(escala, {
        toValue: ativo ? 1.05 : 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    }, [ativo, escala]);

    return (
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: ativo }}
        accessibilityLabel={item.rotuloAcessivel}
        onPress={aoPressionar}
        onPressIn={() => {
          Animated.spring(escala, {
            toValue: 0.92,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(escala, {
            toValue: ativo ? 1.05 : 1,
            useNativeDriver: true,
            friction: 6,
          }).start();
        }}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: tema.raios.completo,
            backgroundColor: ativo
              ? tema.cores.marca.secundario
              : "transparent",
            transform: [{ scale: escala }],
          }}
        >
          <Icone
            nome={item.icone}
            tamanho={20}
            cor={
              ativo
                ? tema.cores.texto.sobreMarca
                : tema.cores.texto.secundario
            }
          />
        </Animated.View>
      </Pressable>
    );
  }
