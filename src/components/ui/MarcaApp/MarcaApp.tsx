import React from "react";
import { Image } from "react-native";

import { useTema } from "../../../hooks/useTema";

/**
 * MarcaApp — renderiza o ícone-marca do app (`assets/images/icon.png`) com
 * cantos arredondados e tamanho configurável. Em modo escuro usa a versão
 * `icon-dark.png` se ela existir.
 *
 * Centralizar essa lógica num único componente garante que o "logo" do app
 * fique consistente em telas (login, sidebar, splash custom, etc.).
 */

export interface PropsMarcaApp {
  tamanho?: number;
  comCantosArredondados?: boolean;
}

const FONTE_CLARO = require("../../../../assets/images/icon.png");
const FONTE_ESCURO = require("../../../../assets/images/icon-dark.png");

export function MarcaApp({
  tamanho = 48,
  comCantosArredondados = true,
}: PropsMarcaApp) {
  const { tema, modo } = useTema();
  return (
    <Image
      source={modo === "escuro" ? FONTE_ESCURO : FONTE_CLARO}
      accessibilityLabel="Logo Clínica"
      resizeMode="cover"
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: comCantosArredondados ? tema.raios.lg : 0,
      }}
    />
  );
}
