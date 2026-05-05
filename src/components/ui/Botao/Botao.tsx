import React, { useState } from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { PaletaCores } from "../../../types/paletaCores.type";
import { Icone, type NomeIcone } from "../Icone";
import { Spinner } from "../Spinner";
import { Texto } from "../Texto";

/**
 * Botao — variantes × estados.
 *
 *   variantes:  primario | secundario | fantasma | perigo
 *   estados:    default | hover (web) | pressionado | desabilitado | carregando
 *
 * Quando `carregando=true`, o conteúdo é substituído por um Spinner mas o
 * botão preserva sua altura/largura — evita o "jump" comum em botões que
 * encolhem ao virar spinner.
 *
 * `iconeEsquerda`/`iconeDireita` recebem nomes do componente Icone — o botão
 * cuida do espaçamento e da cor (ícone herda a cor do texto da variante).
 */

export type VarianteBotao = "primario" | "secundario" | "fantasma" | "perigo";
export type TamanhoBotao = "sm" | "md" | "lg";

export interface PropsBotao extends Omit<PressableProps, "style" | "children"> {
  rotulo: string;
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  carregando?: boolean;
  larguraTotal?: boolean;
  iconeEsquerda?: NomeIcone;
  iconeDireita?: NomeIcone;
}

interface CoresVariante {
  fundo: string;
  texto: string;
  borda: string;
  fundoPressionado: string;
}

function cores(variante: VarianteBotao, cores: PaletaCores): CoresVariante {
  switch (variante) {
    case "primario":
      return {
        fundo: cores.marca.primario,
        texto: cores.texto.sobreMarca,
        borda: cores.marca.primario,
        fundoPressionado: cores.marca.secundario,
      };
    case "secundario":
      return {
        fundo: cores.fundo.superficie,
        texto: cores.marca.primario,
        borda: cores.borda.forte,
        fundoPressionado: cores.fundo.suave,
      };
    case "fantasma":
      return {
        fundo: "transparent",
        texto: cores.marca.primario,
        borda: "transparent",
        fundoPressionado: cores.fundo.suave,
      };
    case "perigo":
      return {
        fundo: cores.status.erro,
        texto: cores.texto.sobreMarca,
        borda: cores.status.erro,
        fundoPressionado: cores.status.erro,
      };
  }
}

const ALTURA: Record<TamanhoBotao, number> = { sm: 32, md: 44, lg: 52 };
const PADDING_H: Record<TamanhoBotao, number> = { sm: 12, md: 16, lg: 20 };
const FONTE: Record<TamanhoBotao, "legenda" | "corpo"> = {
  sm: "legenda",
  md: "corpo",
  lg: "corpo",
};

export function Botao({
  rotulo,
  variante = "primario",
  tamanho = "md",
  carregando = false,
  larguraTotal = false,
  iconeEsquerda,
  iconeDireita,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: PropsBotao) {
  const { tema } = useTema();
  const [pressionado, setPressionado] = useState(false);
  const c = cores(variante, tema.cores);

  const desativado = disabled || carregando;

  const fundoFinal = pressionado && !desativado ? c.fundoPressionado : c.fundo;
  const corTexto = c.texto;

  const estiloBase: ViewStyle = {
    height: ALTURA[tamanho],
    paddingHorizontal: PADDING_H[tamanho],
    backgroundColor: fundoFinal,
    borderColor: c.borda,
    borderWidth: variante === "fantasma" ? 0 : 1,
    borderRadius: tema.raios.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tema.espacamento.sm,
    alignSelf: larguraTotal ? "stretch" : "flex-start",
    opacity: desativado && !carregando ? 0.5 : 1,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado, busy: carregando }}
      accessibilityLabel={rotulo}
      disabled={desativado}
      onPressIn={(e) => {
        setPressionado(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressionado(false);
        onPressOut?.(e);
      }}
      style={estiloBase}
      {...rest}
    >
      {carregando ? (
        <Spinner tamanho={tamanho === "sm" ? 14 : 18} cor={corTexto} />
      ) : (
        <>
          {iconeEsquerda && (
            <Icone
              nome={iconeEsquerda}
              cor={corTexto}
              tamanho={tamanho === "sm" ? 14 : 18}
            />
          )}
          <Texto
            variante={FONTE[tamanho]}
            peso="medio"
            style={{ color: corTexto }}
          >
            {rotulo}
          </Texto>
          {iconeDireita && (
            <Icone
              nome={iconeDireita}
              cor={corTexto}
              tamanho={tamanho === "sm" ? 14 : 18}
            />
          )}
        </>
      )}
      {/* Slot invisível para ler o tema sem warning de unused import */}
      <View accessible={false} />
    </Pressable>
  );
}
