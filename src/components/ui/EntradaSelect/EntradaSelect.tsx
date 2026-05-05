import React, { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Icone } from "../Icone";
import { Texto } from "../Texto";

/**
 * EntradaSelect — dropdown custom com Modal. Optamos por NÃO usar o Picker
 * nativo (vive em @react-native-picker/picker, não está nas deps) e nem o
 * Modal do Picker iOS, que tem um look fora do nosso DS.
 *
 * Ergonomia: tap fora fecha; opção selecionada destacada; escala bem para
 * listas pequenas/médias (≤ 30 itens). Para listas grandes, considere uma
 * variante com busca — não cobre aqui pra não inflar a API.
 */

export interface OpcaoSelect<V extends string | number> {
  valor: V;
  rotulo: string;
}

export interface PropsEntradaSelect<V extends string | number> {
  valor?: V;
  opcoes: ReadonlyArray<OpcaoSelect<V>>;
  aoMudar: (valor: V) => void;
  placeholder?: string;
  erro?: boolean;
  desabilitado?: boolean;
}

export function EntradaSelect<V extends string | number>({
  valor,
  opcoes,
  aoMudar,
  placeholder = "Selecione...",
  erro = false,
  desabilitado = false,
}: PropsEntradaSelect<V>) {
  const { tema } = useTema();
  const [aberto, setAberto] = useState(false);

  const selecionada = opcoes.find((o) => o.valor === valor);

  const corBorda = desabilitado
    ? tema.cores.borda.padrao
    : erro
      ? tema.cores.status.erro
      : aberto
        ? tema.cores.borda.foco
        : tema.cores.borda.forte;

  return (
    <>
      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ disabled: desabilitado, expanded: aberto }}
        disabled={desabilitado}
        onPress={() => setAberto(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          paddingVertical: 12,
          minHeight: 44,
          backgroundColor: desabilitado
            ? tema.cores.fundo.suave
            : tema.cores.fundo.superficie,
          borderColor: corBorda,
          borderWidth: aberto ? 2 : 1,
          borderRadius: tema.raios.md,
        }}
      >
        <Texto
          variante="corpo"
          style={{ flex: 1 }}
          cor={selecionada ? "texto.primario" : "texto.suave"}
        >
          {selecionada?.rotulo ?? placeholder}
        </Texto>
        <Icone nome="chevronBaixo" tamanho={16} cor="texto.suave" />
      </Pressable>

      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable
          onPress={() => setAberto(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: tema.espacamento.xl,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: tema.cores.fundo.superficie,
              borderRadius: tema.raios.lg,
              maxHeight: 360,
              overflow: "hidden",
            }}
          >
            <ScrollView>
              {opcoes.map((opcao) => {
                const ativa = opcao.valor === valor;
                return (
                  <Pressable
                    key={String(opcao.valor)}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: ativa }}
                    onPress={() => {
                      aoMudar(opcao.valor);
                      setAberto(false);
                    }}
                    style={{
                      paddingHorizontal: tema.espacamento.lg,
                      paddingVertical: tema.espacamento.md,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: tema.espacamento.sm,
                      backgroundColor: ativa
                        ? tema.cores.fundo.suave
                        : "transparent",
                    }}
                  >
                    <Texto
                      variante="corpo"
                      peso={ativa ? "medio" : "regular"}
                      style={{ flex: 1 }}
                      cor={ativa ? "marca.primario" : "texto.primario"}
                    >
                      {opcao.rotulo}
                    </Texto>
                    {ativa && (
                      <Icone nome="check" tamanho={16} cor="marca.primario" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
