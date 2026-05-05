import React from "react";
import { Image, View, type ImageSourcePropType } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Texto } from "../Texto";

/**
 * Avatar — imagem ou fallback com iniciais.
 *
 * Cores do fallback são derivadas do nome: hash determinístico mapeia para um
 * dos tokens de marca/status, garantindo que o mesmo nome renderiza sempre a
 * mesma cor (sem aleatoriedade que muda entre renders).
 */

export type TamanhoAvatar = "sm" | "md" | "lg" | "xl";

export interface PropsAvatar {
  nome: string;
  origem?: ImageSourcePropType;
  tamanho?: TamanhoAvatar;
}

const DIMENSOES: Record<TamanhoAvatar, number> = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0]!.slice(0, 2).toUpperCase();
  return (partes[0]![0]! + partes[partes.length - 1]![0]!).toUpperCase();
}

function hashNome(nome: string): number {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ nome, origem, tamanho = "md" }: PropsAvatar) {
  const { tema } = useTema();
  const lado = DIMENSOES[tamanho];

  // Paleta determinística: marca + 3 status (sem erro/aviso para não confundir).
  const paleta = [
    tema.cores.marca.primario,
    tema.cores.marca.secundario,
    tema.cores.status.sucesso,
    tema.cores.status.info,
  ];
  const corFundo = paleta[hashNome(nome) % paleta.length]!;

  if (origem) {
    return (
      <Image
        source={origem}
        accessibilityLabel={`Foto de ${nome}`}
        style={{ width: lado, height: lado, borderRadius: lado / 2 }}
      />
    );
  }

  const tamanhoFonte: Record<TamanhoAvatar, "legenda" | "corpo" | "h3" | "h2"> = {
    sm: "legenda",
    md: "corpo",
    lg: "h3",
    xl: "h2",
  };

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Avatar de ${nome}`}
      style={{
        width: lado,
        height: lado,
        borderRadius: lado / 2,
        backgroundColor: corFundo,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Texto
        variante={tamanhoFonte[tamanho]}
        peso="negrito"
        cor="texto.sobreMarca"
      >
        {iniciais(nome)}
      </Texto>
    </View>
  );
}
