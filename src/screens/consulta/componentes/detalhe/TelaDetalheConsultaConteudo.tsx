// detalhe/TelaDetalheConsultaConteudo.tsx
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divisor, Texto } from "../../../../components";
import { STATUS_CONSULTA_CANCELADOS } from "../../../../constants/consulta";
import { useTema } from "../../../../hooks";
import { Consulta } from "../../../../types/models/consulta.type";
import { SecaoCancelamento } from "./SecaoCancelamento";
import { SecaoDocumentos } from "./SecaoDocumentos";
import { SecaoInformacoes } from "./SecaoInformacoes";
import { SecaoObservacao } from "./SecaoObservacao";
import { SecaoParticipantes } from "./SecaoParticipantes";
import { SecaoProcedimentos } from "./SecaoProcedimento";
import { SecaoStatusConsulta } from "./SecaoStatusConsulta";

export interface PropsTelaDetalheConsulta {
  consulta: Consulta;
  aoEditar?: (consulta: Consulta) => void;
  aoCancelar?: (consulta: Consulta) => void;
  aoVoltar?: () => void;
}

export function TelaDetalheConsultaConteudo({
  consulta,
  aoEditar,
  aoCancelar,
  aoVoltar,
}: PropsTelaDetalheConsulta) {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();

  const estaCancelada = Object.values(STATUS_CONSULTA_CANCELADOS).includes(
    consulta.situacao as never,
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: tema.espacamento.lg,
          paddingBottom: 100 + insets.bottom,
          gap: tema.espacamento.lg,
        }}
      >
        <Texto variante="legenda" cor="texto.suave">
          Consulta #{consulta.numero}
        </Texto>

        <SecaoStatusConsulta
          consulta={consulta}
          aoEditar={aoEditar}
          aoCancelar={aoCancelar}
        />

        <Divisor />

        <SecaoParticipantes
          cliente={consulta.cliente}
          medico={consulta.medico}
        />

        <Divisor />

        <SecaoInformacoes consulta={consulta} />

        {consulta.procedimentos && consulta.procedimentos.length > 0 && (
          <>
            <Divisor />
            <SecaoProcedimentos procedimentos={consulta.procedimentos} />
          </>
        )}

        {(consulta.laudo || consulta.receita) && (
          <>
            <Divisor />
            <SecaoDocumentos
              laudo={consulta.laudo}
              receita={consulta.receita}
            />
          </>
        )}

        {consulta.observacao && (
          <>
            <Divisor />
            <SecaoObservacao observacao={consulta.observacao} />
          </>
        )}

        {estaCancelada && consulta.motivoCancelamento && (
          <>
            <Divisor />
            <SecaoCancelamento motivo={consulta.motivoCancelamento} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
