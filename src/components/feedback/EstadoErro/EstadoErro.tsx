import React from "react";
import { View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import { Botao } from "../../ui/Botao";
import { Icone } from "../../ui/Icone";
import { Texto } from "../../ui/Texto";

/**
 * EstadoErro — falha em operação ou tela. Espelha o EstadoSucesso (mesma
 * hierarquia visual) trocando a cor pelo `status.erro` e o ícone por um X.
 *
 * `descricao` aceita texto livre — recomendamos mensagens orientadas a ação:
 *  ❌ "Erro 400 Bad Request"
 *  ✅ "Não conseguimos cadastrar o cliente. Verifique os campos e tente de novo."
 *
 * `detalheTecnico` aparece menor abaixo, opcional, pra permitir suporte/debug.
 */

export interface PropsEstadoErro {
  titulo: string;
  descricao?: string;
  detalheTecnico?: string;
  rotuloAcao?: string;
  aoExecutarAcao?: () => void;
}

export function EstadoErro({
  titulo,
  descricao,
  detalheTecnico,
  rotuloAcao = "Tentar novamente",
  aoExecutarAcao,
}: PropsEstadoErro) {
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
          borderColor: tema.cores.status.erro,
          backgroundColor: tema.cores.fundo.superficie,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icone nome="fechar" tamanho={32} cor="status.erro" />
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
        {detalheTecnico && (
          <Texto
            variante="legenda"
            cor="texto.suave"
            alinhamento="center"
          >
            {detalheTecnico}
          </Texto>
        )}
      </View>

      {aoExecutarAcao && (
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
