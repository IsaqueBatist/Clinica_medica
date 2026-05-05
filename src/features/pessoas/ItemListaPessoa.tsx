import React from "react";
import { View } from "react-native";

import { useTema } from "../../hooks/useTema";
import { Avatar } from "../../components/ui/Avatar";
import { Badge, type VarianteBadge } from "../../components/ui/Badge";
import { Botao } from "../../components/ui/Botao";
import { Card } from "../../components/ui/Card";
import { Texto } from "../../components/ui/Texto";

/**
 * ItemListaPessoa — composite reutilizável para qualquer "pessoa" (cliente,
 * médico, recepcionista, etc.) numa lista. Os wrappers `ItemListaCliente` e
 * `ItemListaMedico` mapeiam o domínio sobre este shape, evitando duplicação.
 *
 * Layout (melhorado em relação ao anexo 2):
 *  - hierarquia visual clara: identificador (legenda) → nome (h3) → linha extra
 *    (legenda secundária, ex: especialidade)
 *  - ações sempre alinhadas à direita; "Ver perfil" como secundária, "Editar"
 *    como ghost — nenhuma das duas é primária pra não competir com CTAs de
 *    topo de tela (criar cliente, etc.)
 *  - badge de status no topo direito
 */

export interface PropsItemListaPessoa {
  identificacao: string;
  nome: string;
  linhaExtra?: string;
  rotuloStatus?: string;
  varianteStatus?: VarianteBadge;
  aoVerPerfil?: () => void;
  aoEditar?: () => void;
}

export function ItemListaPessoa({
  identificacao,
  nome,
  linhaExtra,
  rotuloStatus,
  varianteStatus = "neutro",
  aoVerPerfil,
  aoEditar,
}: PropsItemListaPessoa) {
  const { tema } = useTema();

  return (
    <Card variante="elevado" preenchimento="md">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.md,
        }}
      >
        <Avatar nome={nome} tamanho="md" />

        <View style={{ flex: 1, gap: 2 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.sm,
            }}
          >
            <Texto variante="legenda" cor="texto.suave" peso="medio">
              #{identificacao}
            </Texto>
            {rotuloStatus && (
              <Badge variante={varianteStatus}>{rotuloStatus}</Badge>
            )}
          </View>
          <Texto variante="corpo" peso="negrito">
            {nome}
          </Texto>
          {linhaExtra && (
            <Texto variante="legenda" cor="texto.secundario">
              {linhaExtra}
            </Texto>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: tema.espacamento.sm,
          marginTop: tema.espacamento.md,
        }}
      >
        {aoVerPerfil && (
          <Botao
            rotulo="Ver perfil"
            variante="secundario"
            tamanho="sm"
            iconeEsquerda="olho"
            onPress={aoVerPerfil}
          />
        )}
        {aoEditar && (
          <Botao
            rotulo="Editar"
            variante="fantasma"
            tamanho="sm"
            iconeEsquerda="editar"
            onPress={aoEditar}
          />
        )}
      </View>
    </Card>
  );
}
