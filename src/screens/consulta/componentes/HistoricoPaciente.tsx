import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Texto } from "../../../components";
import { STATUS_CONSULTA } from "../../../constants/consulta";
import { useTema } from "../../../hooks";
import { Consulta } from "../../../types/models/consulta.type";


interface PropsHistoricoPaciente {
  consultas: Consulta[];
  largura: number;
}

const LIMITE_ACCORDION = 400;

function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function usarCorSituacao(situacao: string, tema: any): string {
  switch (situacao) {
    case STATUS_CONSULTA.REALIZADA:
    case STATUS_CONSULTA.ENCERRADA:
      return tema.cores.status.sucesso;
    case STATUS_CONSULTA.CANCELADA_PELO_CLIENTE:
    case STATUS_CONSULTA.CANCELADA_PELO_MEDICO:
    case STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO:
      return tema.cores.status.erro;
    default:
      return tema.cores.texto.suave;
  }
}

function ItemHistorico({ consulta }: { consulta: Consulta }) {
  const { tema } = useTema();
  const corStatus = usarCorSituacao(consulta.situacao, tema);

  return (
    <View
      style={{
        paddingVertical: tema.espacamento.sm,
        gap: 6,
      }}
    >
      {/* Linha de data + badge de status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.texto.secundario }}>
          {formatarData(consulta.dataHora)}
        </Texto>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 99,
            backgroundColor: corStatus + "22",
          }}
        >
          <Texto variante="legenda" style={{ color: corStatus, fontSize: 11, fontWeight: "600" }}>
            {consulta.situacao}
          </Texto>
        </View>
      </View>

      {consulta.laudo ? (
        <Texto variante="legenda" cor="texto.suave" numberOfLines={2} style={{ lineHeight: 18 }}>
          <Texto variante="legenda" peso="medio" style={{ color: tema.cores.texto.secundario }}>
            Laudo:{" "}
          </Texto>
          {consulta.laudo}
        </Texto>
      ) : null}

      {consulta.receita ? (
        <Texto variante="legenda" cor="texto.suave" numberOfLines={2} style={{ lineHeight: 18 }}>
          <Texto variante="legenda" peso="medio" style={{ color: tema.cores.texto.secundario }}>
            Receita:{" "}
          </Texto>
          {consulta.receita}
        </Texto>
      ) : null}
    </View>
  );
}

function CabecalhoHistorico({
  total,
  expandido,
  aoToggle,
  accordion,
}: {
  total: number;
  expandido?: boolean;
  aoToggle?: () => void;
  accordion: boolean;
}) {
  const { tema } = useTema();

  const conteudo = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: tema.espacamento.sm,
        backgroundColor: tema.cores.fundo.suave,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            backgroundColor: tema.cores.marca.secundario,
          }}
        />
        <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.texto.secundario }}>
          Histórico do paciente
        </Texto>
        <View
          style={{
            paddingHorizontal: 7,
            paddingVertical: 1,
            borderRadius: 99,
            backgroundColor: tema.cores.marca.primario + "22",
          }}
        >
          <Texto variante="legenda" style={{ color: tema.cores.marca.primario, fontWeight: "700", fontSize: 11 }}>
            {total}
          </Texto>
        </View>
      </View>
      {accordion && (
        <Texto variante="legenda" style={{ color: tema.cores.texto.suave }}>
          {expandido ? "▲" : "▼"}
        </Texto>
      )}
    </View>
  );

  if (accordion && aoToggle) {
    return (
      <TouchableOpacity
        onPress={aoToggle}
        accessibilityRole="button"
        accessibilityLabel={expandido ? "Recolher histórico" : "Expandir histórico do paciente"}
        activeOpacity={0.7}
      >
        {conteudo}
      </TouchableOpacity>
    );
  }

  return conteudo;
}

/**
 * HistoricoPaciente
 *
 * < 400px → accordion colapsável (preserva espaço vertical no celular).
 * >= 400px → painel lateral sempre visível.
 *
 * Read-only, focado em laudo/receita. Distinto do HistoricoAccordion
 * da tela de cliente (que tem ações e mais detalhes).
 */
export function HistoricoPaciente({ consultas, largura }: PropsHistoricoPaciente) {
  const { tema } = useTema();
  const [expandido, setExpandido] = useState(false);
  const modoAccordion = largura < LIMITE_ACCORDION;

  const listaVazia = (
    <View style={{ padding: tema.espacamento.sm }}>
      <Texto variante="legenda" cor="texto.suave">
        Nenhuma consulta anterior registrada.
      </Texto>
    </View>
  );

  const listaConsultas = (
    <ScrollView
      style={{ maxHeight: modoAccordion ? 220 : undefined }}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      {consultas.map((c, i) => (
        <View key={c.numero}>
          <ItemHistorico consulta={c} />
          {i < consultas.length - 1 && (
            <View style={{ height: 1, backgroundColor: tema.cores.borda.padrao }} />
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        borderRadius: tema.raios.lg,
        overflow: "hidden",
        flex: modoAccordion ? undefined : 1,
      }}
    >
      <CabecalhoHistorico
        total={consultas.length}
        expandido={expandido}
        aoToggle={() => setExpandido((v) => !v)}
        accordion={modoAccordion}
      />

      {(!modoAccordion || expandido) && (
        <View style={{ padding: tema.espacamento.sm, backgroundColor: tema.cores.fundo.primario }}>
          {consultas.length === 0 ? listaVazia : listaConsultas}
        </View>
      )}
    </View>
  );
}