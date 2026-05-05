import React, { useState, forwardRef } from "react";
import {
  TextInput,
  View,
  Pressable,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone, type NomeIcone } from "../Icone";

/**
 * EntradaTexto — input base. Aceita os mesmos `tipo` que cobrimos no design
 * system (text, email, password, number) e mapeia para `keyboardType`,
 * `autoCapitalize` e `secureTextEntry` apropriados.
 *
 * Estados visuais (default/foco/erro/desabilitado) vivem aqui, não num arquivo
 * separado de "states" — variantes de borda/cor são pequenas o suficiente para
 * serem locais e ficam mais legíveis junto ao componente que as usa.
 */

export type TipoEntrada = "texto" | "email" | "senha" | "numero" | "telefone";

export interface PropsEntradaTexto extends Omit<TextInputProps, "style"> {
  tipo?: TipoEntrada;
  erro?: boolean;
  iconeEsquerda?: NomeIcone;
  /**
   * Se true em uma entrada do tipo `senha`, mostra o ícone-olho para alternar
   * visibilidade. Default: true para `senha`, false para os demais.
   */
  permitirRevelar?: boolean;
}

export const EntradaTexto = forwardRef<TextInput, PropsEntradaTexto>(
  (
    {
      tipo = "texto",
      erro = false,
      iconeEsquerda,
      permitirRevelar,
      editable = true,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { tema } = useTema();
    const [focado, setFocado] = useState(false);
    const [revelar, setRevelar] = useState(false);

    const ehSenha = tipo === "senha";
    const podeRevelar = ehSenha && (permitirRevelar ?? true);

    const corBorda = !editable
      ? tema.cores.borda.padrao
      : erro
        ? tema.cores.status.erro
        : focado
          ? tema.cores.borda.foco
          : tema.cores.borda.forte;

    const fundo = !editable ? tema.cores.fundo.suave : tema.cores.fundo.superficie;

    const containerEstilo: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      gap: tema.espacamento.sm,
      paddingHorizontal: tema.espacamento.md,
      backgroundColor: fundo,
      borderColor: corBorda,
      borderWidth: focado ? 2 : 1,
      borderRadius: tema.raios.md,
      // compensa a mudança de espessura da borda para evitar "pulo" no foco
      paddingVertical: focado ? Math.max(0, 12 - 1) : 12,
      minHeight: 44,
    };

    const propsTipo: Partial<TextInputProps> = (() => {
      switch (tipo) {
        case "email":
          return {
            keyboardType: "email-address",
            autoCapitalize: "none",
            autoCorrect: false,
            textContentType: "emailAddress",
          };
        case "senha":
          return {
            secureTextEntry: !revelar,
            autoCapitalize: "none",
            autoCorrect: false,
            textContentType: "password",
          };
        case "numero":
          return { keyboardType: "numeric" };
        case "telefone":
          return { keyboardType: "phone-pad", textContentType: "telephoneNumber" };
        default:
          return {};
      }
    })();

    return (
      <View style={containerEstilo}>
        {iconeEsquerda && (
          <Icone
            nome={iconeEsquerda}
            tamanho={18}
            cor={focado ? tema.cores.marca.secundario : tema.cores.texto.suave}
          />
        )}
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={tema.cores.texto.suave}
          onFocus={(e) => {
            setFocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            color: tema.cores.texto.primario,
            fontSize: tema.tipografia.tamanho.corpo,
            fontFamily: tema.tipografia.familia.sans,
            padding: 0, // Android adiciona padding default; zeramos pra altura ficar previsível
          }}
          {...propsTipo}
          {...rest}
        />
        {podeRevelar && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revelar ? "Ocultar senha" : "Mostrar senha"}
            onPress={() => setRevelar((v) => !v)}
            hitSlop={8}
          >
            <Icone
              nome="olho"
              tamanho={18}
              cor={revelar ? tema.cores.marca.secundario : tema.cores.texto.suave}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

EntradaTexto.displayName = "EntradaTexto";
