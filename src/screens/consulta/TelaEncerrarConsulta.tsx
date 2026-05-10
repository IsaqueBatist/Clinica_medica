import React, { useState, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useContextoConsulta } from "../../hooks/useContextoConsulta"; // Assumindo hook exportado
import { Consulta } from "../../types/models/consulta.type";
import { FORMA_PAGAMENTO, STATUS_CONSULTA } from "../../constants/consulta";
import { Texto, BotaoIcone } from "../../components/ui";
import { ConsultaRealizadaItem } from "./componentes/encerrar/ConsultaRealizadaItem";
import { EncerramentoForm } from "./componentes/encerrar/EncerramentoForm";
import { EncerramentoFormData } from "./componentes/encerrar/encerramentoSchema";
import { useToast } from "../../hooks";

export const TelaEncerrarConsulta = () => {
  const contexto = useContextoConsulta();
  const toast = useToast();

  if (!contexto) {
    throw new Error(
      "EncerrarConsultaScreen deve ser renderizado dentro de um ProvedorConsulta",
    );
  }

  const {
    state: { items: consultas },
    encerrarConsulta,
  } = contexto;

  const [consultaSelecionada, setConsultaSelecionada] =
    useState<Consulta | null>(null);

  const consultasPendentes = useMemo(() => {
    return consultas.filter((c) => c.situacao === STATUS_CONSULTA.REALIZADA);
  }, [consultas]);

  const handleEncerrar = async (dados: EncerramentoFormData) => {
    if (!consultaSelecionada) return;

    try {
      const payloadDTO = {
        tipo: consultaSelecionada.tipo,
        formaPagamento:
          FORMA_PAGAMENTO[
            consultaSelecionada.formaPagamento as keyof typeof FORMA_PAGAMENTO
          ],
        valor: dados.valor,
        procedimentos: dados.procedimentos,
      };

      await encerrarConsulta(consultaSelecionada.numero, payloadDTO);
      toast.exibir({
        variante: "sucesso",
        titulo: "Consulta encerrada com sucesso",
      });
      setConsultaSelecionada(null);
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Falha ao processar encerramento.",
      );
    }
  };

  if (consultaSelecionada) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Texto variante="h3" peso="negrito" style={{ marginLeft: 8 }}>
            {consultaSelecionada.cliente.nome}
          </Texto>
        </View>

        <EncerramentoForm
          consultaNumero={consultaSelecionada.numero}
          tipoInicial={consultaSelecionada.tipo}
          onSubmit={handleEncerrar}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {consultasPendentes.length === 0 ? (
        <Texto variante="corpo" style={{ textAlign: "center", marginTop: 32 }}>
          Nenhuma consulta aguardando encerramento no momento.
        </Texto>
      ) : (
        consultasPendentes.map((consulta) => (
          <ConsultaRealizadaItem
            key={consulta.numero} // Key estrita baseada no identificador do modelo
            consulta={consulta}
            onSelecionar={(numero) => {
              const alvo = consultasPendentes.find((c) => c.numero === numero);
              if (alvo) setConsultaSelecionada(alvo);
            }}
          />
        ))
      )}
    </ScrollView>
  );
};
