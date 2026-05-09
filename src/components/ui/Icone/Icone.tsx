import React from "react";
import { View, type ViewStyle } from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { PaletaCores } from "../../../types/paletaCores.type";

/**
 * Biblioteca de ícones composta apenas com `View` — sem dependências
 * externas (react-native-svg, vector-icons). Decisão consciente:
 *  - Bundle menor.
 *  - Estilo coerente entre plataformas.
 *  - Suficiente para o conjunto de glifos que esta clínica precisa.
 *
 * Cada ícone respeita `tamanho` (padrão 20) e `cor` (token). Os caminhos
 * geométricos são proporcionais ao tamanho — nada hardcoded.
 *
 * Para adicionar um novo ícone: criar um novo case no switch e usar `t = tamanho`
 * como fator de escala. Não usar pixels mágicos.
 */

export type NomeIcone =
  | "casa"
  | "usuario"
  | "medico"
  | "calendario"
  | "busca"
  | "mais"
  | "fechar"
  | "check"
  | "aviso"
  | "info"
  | "olho"
  | "editar"
  | "menu"
  | "chevronDireita"
  | "chevronBaixo"
  | "tema"
  | "sair";

export interface PropsIcone {
  nome: NomeIcone;
  tamanho?: number;
  cor?: string;
}

type CaminhoCor =
  | `texto.${keyof PaletaCores["texto"]}`
  | `marca.${keyof PaletaCores["marca"]}`
  | `status.${keyof PaletaCores["status"]}`;

interface PropsIconeTema extends Omit<PropsIcone, "cor"> {
  cor?: string | CaminhoCor;
}

function resolverCor(
  cores: PaletaCores,
  cor: string | CaminhoCor | undefined,
  fallback: string,
): string {
  if (!cor) return fallback;
  if (cor.includes(".")) {
    const [grupo, chave] = cor.split(".") as [keyof PaletaCores, string];
    const grupoCores = cores[grupo] as Record<string, string> | undefined;
    return grupoCores?.[chave] ?? fallback;
  }
  return cor;
}

export function Icone({ nome, tamanho = 20, cor }: PropsIconeTema) {
  const { tema } = useTema();
  const corResolvida = resolverCor(tema.cores, cor, tema.cores.texto.primario);
  const t = tamanho;
  const traco = Math.max(1.5, Math.round(t / 12));

  const linha = (estilo: ViewStyle): ViewStyle => ({
    position: "absolute",
    backgroundColor: corResolvida,
    ...estilo,
  });

  const wrap: ViewStyle = {
    width: t,
    height: t,
    alignItems: "center",
    justifyContent: "center",
  };

  switch (nome) {
    case "casa":
      return (
        <View style={wrap}>
          <View
            style={{
              position: "absolute",
              top: t * 0.05,
              width: t * 0.9,
              height: t * 0.55,
              borderTopWidth: traco,
              borderLeftWidth: traco,
              borderRightWidth: traco,
              borderColor: corResolvida,
              transform: [{ rotate: "45deg" }, { scale: 0.7 }],
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.1,
              width: t * 0.7,
              height: t * 0.5,
              borderWidth: traco,
              borderColor: corResolvida,
              borderTopWidth: 0,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.1,
              width: t * 0.18,
              height: t * 0.25,
              backgroundColor: corResolvida,
            }}
          />
        </View>
      );

    case "usuario":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.42,
              height: t * 0.42,
              borderRadius: t * 0.21,
              borderWidth: traco,
              borderColor: corResolvida,
              position: "absolute",
              top: t * 0.1,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.1,
              width: t * 0.78,
              height: t * 0.4,
              borderTopLeftRadius: t * 0.4,
              borderTopRightRadius: t * 0.4,
              borderWidth: traco,
              borderColor: corResolvida,
              borderBottomWidth: 0,
            }}
          />
        </View>
      );

    case "medico":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.85,
              height: t * 0.85,
              borderRadius: t * 0.425,
              borderWidth: traco,
              borderColor: corResolvida,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: traco,
                height: t * 0.4,
                backgroundColor: corResolvida,
                position: "absolute",
              }}
            />
            <View
              style={{
                width: t * 0.4,
                height: traco,
                backgroundColor: corResolvida,
                position: "absolute",
              }}
            />
          </View>
        </View>
      );

    case "calendario":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.85,
              height: t * 0.8,
              borderWidth: traco,
              borderRadius: traco,
              borderColor: corResolvida,
              marginTop: t * 0.1,
            }}
          />
          <View
            style={linha({
              top: t * 0.32,
              left: t * 0.075,
              right: t * 0.075,
              height: traco,
            })}
          />
          <View
            style={linha({
              top: t * 0.05,
              left: t * 0.22,
              width: traco,
              height: t * 0.18,
            })}
          />
          <View
            style={linha({
              top: t * 0.05,
              right: t * 0.22,
              width: traco,
              height: t * 0.18,
            })}
          />
        </View>
      );

    case "busca":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.6,
              height: t * 0.6,
              borderRadius: t * 0.3,
              borderWidth: traco,
              borderColor: corResolvida,
              position: "absolute",
              top: t * 0.05,
              left: t * 0.05,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.1,
              right: t * 0.1,
              width: t * 0.3,
              height: traco,
              backgroundColor: corResolvida,
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>
      );

    case "mais":
      return (
        <View style={wrap}>
          <View
            style={linha({
              left: t * 0.15,
              right: t * 0.15,
              top: (t - traco) / 2,
              height: traco,
              borderRadius: traco,
            })}
          />
          <View
            style={linha({
              top: t * 0.15,
              bottom: t * 0.15,
              left: (t - traco) / 2,
              width: traco,
              borderRadius: traco,
            })}
          />
        </View>
      );

    case "fechar":
      return (
        <View style={wrap}>
          <View
            style={linha({
              left: t * 0.15,
              right: t * 0.15,
              top: (t - traco) / 2,
              height: traco,
              transform: [{ rotate: "45deg" }],
            })}
          />
          <View
            style={linha({
              left: t * 0.15,
              right: t * 0.15,
              top: (t - traco) / 2,
              height: traco,
              transform: [{ rotate: "-45deg" }],
            })}
          />
        </View>
      );

    case "check":
      return (
        <View style={wrap}>
          <View
            style={{
              position: "absolute",
              left: t * 0.18,
              top: t * 0.5,
              width: t * 0.3,
              height: traco,
              backgroundColor: corResolvida,
              transform: [{ rotate: "45deg" }],
              borderRadius: traco,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: t * 0.32,
              top: t * 0.45,
              width: t * 0.55,
              height: traco,
              backgroundColor: corResolvida,
              transform: [{ rotate: "-50deg" }],
              borderRadius: traco,
            }}
          />
        </View>
      );

    case "aviso":
      return (
        <View style={wrap}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: t * 0.45,
              borderRightWidth: t * 0.45,
              borderBottomWidth: t * 0.8,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: corResolvida,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.22,
              width: traco,
              height: t * 0.3,
              backgroundColor: tema.cores.fundo.superficie,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: t * 0.13,
              width: traco,
              height: traco,
              borderRadius: traco,
              backgroundColor: tema.cores.fundo.superficie,
            }}
          />
        </View>
      );

    case "info":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t,
              height: t,
              borderRadius: t / 2,
              borderWidth: traco,
              borderColor: corResolvida,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: traco,
                height: traco,
                borderRadius: traco,
                backgroundColor: corResolvida,
                marginTop: -t * 0.18,
              }}
            />
            <View
              style={{
                width: traco,
                height: t * 0.28,
                backgroundColor: corResolvida,
                marginTop: t * 0.05,
              }}
            />
          </View>
        </View>
      );

    case "olho":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.9,
              height: t * 0.55,
              borderTopLeftRadius: t * 0.45,
              borderTopRightRadius: t * 0.45,
              borderBottomLeftRadius: t * 0.45,
              borderBottomRightRadius: t * 0.45,
              borderWidth: traco,
              borderColor: corResolvida,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: t * 0.28,
                height: t * 0.28,
                borderRadius: t * 0.14,
                backgroundColor: corResolvida,
              }}
            />
          </View>
        </View>
      );

    case "editar":
      return (
        <View style={wrap}>
          <View
            style={{
              position: "absolute",
              left: t * 0.18,
              top: t * 0.18,
              width: t * 0.65,
              height: traco * 1.8,
              backgroundColor: corResolvida,
              transform: [{ rotate: "45deg" }, { translateX: t * 0.05 }],
              borderRadius: traco / 2,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: t * 0.12,
              top: t * 0.12,
              width: t * 0.22,
              height: traco * 1.8,
              backgroundColor: corResolvida,
              transform: [{ rotate: "45deg" }],
              borderRadius: traco / 2,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: t * 0.1,
              bottom: t * 0.12,
              width: 0,
              height: 0,
              borderLeftWidth: t * 0.1,
              borderTopWidth: t * 0.1,
              borderLeftColor: "transparent",
              borderTopColor: "transparent",
              borderRightWidth: t * 0.1,
              borderBottomWidth: t * 0.1,
              borderRightColor: corResolvida,
              borderBottomColor: corResolvida,
            }}
          />
        </View>
      );

    case "menu":
      return (
        <View style={wrap}>
          <View
            style={linha({
              left: t * 0.1,
              right: t * 0.1,
              top: t * 0.25,
              height: traco,
              borderRadius: traco,
            })}
          />
          <View
            style={linha({
              left: t * 0.1,
              right: t * 0.1,
              top: (t - traco) / 2,
              height: traco,
              borderRadius: traco,
            })}
          />
          <View
            style={linha({
              left: t * 0.1,
              right: t * 0.1,
              bottom: t * 0.25,
              height: traco,
              borderRadius: traco,
            })}
          />
        </View>
      );

    case "chevronDireita":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.35,
              height: t * 0.35,
              borderTopWidth: traco,
              borderRightWidth: traco,
              borderColor: corResolvida,
              transform: [{ rotate: "45deg" }, { translateX: -t * 0.05 }],
            }}
          />
        </View>
      );

    case "chevronBaixo":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.35,
              height: t * 0.35,
              borderBottomWidth: traco,
              borderRightWidth: traco,
              borderColor: corResolvida,
              transform: [{ rotate: "45deg" }, { translateY: -t * 0.05 }],
            }}
          />
        </View>
      );

    case "tema":
      return (
        <View style={wrap}>
          <View
            style={{
              width: t * 0.7,
              height: t * 0.7,
              borderRadius: t * 0.35,
              borderWidth: traco,
              borderColor: corResolvida,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: t * 0.35,
                height: t * 0.7,
                backgroundColor: corResolvida,
              }}
            />
          </View>
        </View>
      );

    case "sair":
      return (
        <View style={wrap}>
          <View
            style={{
              position: "absolute",
              left: t * 0.1,
              top: t * 0.15,
              bottom: t * 0.15,
              width: t * 0.45,
              borderTopWidth: traco,
              borderLeftWidth: traco,
              borderBottomWidth: traco,
              borderColor: corResolvida,
              borderTopLeftRadius: traco,
              borderBottomLeftRadius: traco,
            }}
          />
          <View
            style={linha({
              right: t * 0.1,
              top: (t - traco) / 2,
              width: t * 0.5,
              height: traco,
            })}
          />
          <View
            style={{
              position: "absolute",
              right: t * 0.1,
              top: t * 0.3,
              width: t * 0.22,
              height: t * 0.22,
              borderTopWidth: traco,
              borderRightWidth: traco,
              borderColor: corResolvida,
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>
      );

    default:
      return <View style={wrap} />;
  }
}
