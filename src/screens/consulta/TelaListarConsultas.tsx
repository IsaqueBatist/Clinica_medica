import React, { useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useContextoConsulta } from "../../hooks/useContextoConsulta";
import {
  CalendarioDia,
  ConsultaCalendario,
} from "../../features/consultas/CalendarioDia";
import { Texto } from "../../components/ui/Texto";
import { Routes } from "../../constants/routes";
import type { ConsultasStackParamList } from "../../navigation/types";
import { useTema } from "../../hooks/useTema";

type ListarConsultasNavigationProp = NativeStackNavigationProp<
  ConsultasStackParamList,
  typeof Routes.ListarConsultas
>;

export function TelaListarConsultas() {
  const { state } = useContextoConsulta();
  const navigation = useNavigation<ListarConsultasNavigationProp>();
  const { tema } = useTema();

  const [dataSelecionada, _] = useState(new Date());

  const consultasDoDia = useMemo<ConsultaCalendario[]>(() => {
    return state.items
      .filter((consulta) => {
        const dataConsulta = new Date(consulta.dataHora);
        return (
          dataConsulta.getFullYear() === dataSelecionada.getFullYear() &&
          dataConsulta.getMonth() === dataSelecionada.getMonth() &&
          dataConsulta.getDate() === dataSelecionada.getDate()
        );
      })
      .map((consulta) => ({
        id: consulta.numero,
        dataHora: new Date(consulta.dataHora),
        duracaoMinutos: 30,
        nomePaciente: consulta.cliente.nome,
        nomeMedico: consulta.medico.nome,
        status: consulta.situacao,
      }));
  }, [state.items, dataSelecionada]);

  if (state.loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={tema.cores.fundo.primario} />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Texto cor="status.erro">
          Erro ao carregar consultas: {state.error}
        </Texto>
      </View>
    );
  }

  return (
    <CalendarioDia
      data={dataSelecionada}
      consultas={consultasDoDia}
      aoSelecionarConsulta={(id) => {
        navigation.navigate(Routes.DetalheConsulta, { id });
      }}
    />
  );
}
