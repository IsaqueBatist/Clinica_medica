import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Botao } from "../../ui/Botao";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { Texto } from "../../ui/Texto";

/**
 * EstadoSucesso — confirmação de uma operação. Visual calmo (não comemorativo):
 * círculo verde com check + texto curto + CTA opcional.
 *
 * Princípio: o título do estado nomeia o que aconteceu (substantivo no
 * particípio: "Cadastrado"), não a ação que o usuário fez. "Cliente
 * cadastrado" lê melhor do que "Você cadastrou o cliente".
 */

export interface PropsEstadoSucesso {
  titulo: string;
  descricao?: string;
  rotuloAcao?: string;
  aoExecutarAcao?: () => void;
  nomeIcone?: NomeIcone;
}

export function EstadoSucesso({
  titulo,
  descricao,
  rotuloAcao,
  aoExecutarAcao,
  nomeIcone = "check",
}: PropsEstadoSucesso) {
  const { tema } = useTema();

  return (
    <View
      accessibilityRole="alert"
      style={{
        alignItems: "center",
        gap: tema.espacamento.lg,
        padding: tema.espacamento.xl,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          borderWidth: 2,
          borderColor: tema.cores.status.sucesso,
          backgroundColor: tema.cores.fundo.superficie,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icone nome={nomeIcone} tamanho={32} cor="status.sucesso" />
      </View>

      <View style={{ alignItems: "center", gap: tema.espacamento.xs }}>
        <Texto variante="h3" peso="negrito" alinhamento="center">
          {titulo}
        </Texto>
        {descricao && (
          <Texto
            variante="corpo"
            cor="texto.secundario"
            alinhamento="center"
          >
            {descricao}
          </Texto>
        )}
      </View>

      {rotuloAcao && aoExecutarAcao && (
        <Botao
          rotulo={rotuloAcao}
          variante="secundario"
          iconeDireita="chevronDireita"
          onPress={aoExecutarAcao}
        />
      )}
    </View>
  );
}
