import { View } from "react-native";
import { Card, Texto, Badge } from "../../../../components";
import {
  STATUS_CONSULTA_VARIANTE,
  TIPO_CONSULTA_LABEL,
  STATUS_CONSULTA_LABEL,
} from "../../../../constants/consulta";
import { useTema } from "../../../../hooks";
import { Consulta } from "../../../../types/models/consulta.type";

interface Props {
  consulta: Consulta;
  aoEditar?: (c: Consulta) => void;
  aoCancelar?: (c: Consulta) => void;
}

export function SecaoStatusConsulta({ consulta, aoEditar, aoCancelar }: Props) {
  const { tema } = useTema();

  return (
    <Card preenchimento="lg">
      <View style={{ gap: tema.espacamento.md }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: tema.espacamento.sm,
          }}
        >
          {/* Tipo da consulta */}
          <Texto variante="h2" peso="negrito">
            {TIPO_CONSULTA_LABEL[consulta.tipo]}
          </Texto>

          {/* Badge de situação */}
          <Badge variante={STATUS_CONSULTA_VARIANTE[consulta.situacao]}>
            {STATUS_CONSULTA_LABEL[consulta.situacao]}
          </Badge>
        </View>

        {/* Ações */}
        {(aoEditar || aoCancelar) && (
          <View
            style={{
              flexDirection: "row",
              gap: tema.espacamento.sm,
              flexWrap: "wrap",
            }}
          ></View>
        )}
      </View>
    </Card>
  );
}
