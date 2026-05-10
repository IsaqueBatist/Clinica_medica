import React from "react";
import { View } from "react-native";
import { Consulta } from "../../../../types/models/consulta.type";
import { Card, Texto, Botao, Divisor } from "../../../../components/ui";

interface ConsultaRealizadaItemProps {
  consulta: Consulta;
  onSelecionar: (numero: string) => void;
}

export const ConsultaRealizadaItem: React.FC<ConsultaRealizadaItemProps> = ({
  consulta,
  onSelecionar,
}) => {
  return (
    <Card style={{ marginBottom: 16, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Texto variante="corpo" peso="negrito">
            {consulta.cliente.nome}
          </Texto>
          <Texto variante="legenda" style={{ marginTop: 4, color: "#666" }}>
            {new Date(consulta.dataHora).toLocaleDateString("pt-BR")} •{" "}
            {consulta.tipo}
          </Texto>
        </View>
      </View>

      <Divisor margem={12} />

      <Botao
        rotulo="Registrar Encerramento"
        variante="secundario"
        tamanho="sm"
        larguraTotal
        onPress={() => onSelecionar(consulta.numero)}
      />
    </Card>
  );
};
