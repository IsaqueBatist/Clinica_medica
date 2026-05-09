import React, { useState } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone, type NomeIcone } from "../Icone";

/**
 * BotaoIcone — botão somente-ícone para barras, FABs, ações de linha em listas.
 * Mantém alvo de toque ≥ 36×36 mesmo quando o ícone é pequeno (acessibilidade
 * mínima recomendada para mobile).
 */

export type VarianteBotaoIcone = "neutro" | "marca" | "perigo" | "flutuante";

export interface PropsBotaoIcone
  extends Omit<PressableProps, "style" | "children"> {
  nomeIcone: NomeIcone;
  rotuloAcessivel: string;
  variante?: VarianteBotaoIcone;
  tamanho?: number;
}

export function BotaoIcone({
  nomeIcone,
  rotuloAcessivel,
  variante = "neutro",
  tamanho = 20,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: PropsBotaoIcone) {
  const { tema } = useTema();
  const [pressionado, setPressionado] = useState(false);
  const ladoToque = Math.max(36, tamanho + 16);

  const fundoBase: Record<VarianteBotaoIcone, string> = {
    neutro: "transparent",
    marca: tema.cores.marca.primario,
    perigo: tema.cores.status.erro,
    flutuante: tema.cores.fundo.superficie,
  };
  const corIcone: Record<VarianteBotaoIcone, string> = {
    neutro: tema.cores.texto.secundario,
    marca: tema.cores.texto.sobreMarca,
    perigo: tema.cores.texto.sobreMarca,
    flutuante: tema.cores.marca.primario,
  };
  const fundoPressionado: Record<VarianteBotaoIcone, string> = {
    neutro: tema.cores.fundo.suave,
    marca: tema.cores.marca.secundario,
    perigo: tema.cores.status.erro,
    flutuante: tema.cores.fundo.suave,
  };

  const estilo: ViewStyle = {
    width: ladoToque,
    height: ladoToque,
    borderRadius: tema.raios.completo,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      pressionado && !disabled ? fundoPressionado[variante] : fundoBase[variante],
    opacity: disabled ? 0.5 : 1,
    ...(variante === "flutuante" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    }),
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      accessibilityState={{ disabled: disabled ?? undefined }}
      disabled={disabled}
      onPressIn={(e) => {
        setPressionado(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressionado(false);
        onPressOut?.(e);
      }}
      style={estilo}
      {...rest}
    >
      <Icone nome={nomeIcone} tamanho={tamanho} cor={corIcone[variante]} />
    </Pressable>
  );
}
