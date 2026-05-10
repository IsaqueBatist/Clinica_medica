import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useRoute,
  useNavigation,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Design System e Hooks
import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import { Texto, Divisor, Botao, Badge } from "../../components/ui";
import { STATUS_PESSOA_LABEL } from "../../constants/pessoa";

// Domínio e Serviços
import { servicoCliente } from "../../services/ClienteService.service";
import { Routes } from "../../constants/routes";
import type { Cliente } from "../../types/models/cliente.type";
import type { ClientesStackParamList } from "../../navigation/types";

type DetalheRouteProp = RouteProp<ClientesStackParamList, "DetalheCliente">;
type DetalheNavProp = NativeStackNavigationProp<ClientesStackParamList>;

export function TelaDetalheCliente() {
  const { tema } = useTema();
  const { exibir } = useToast();
  const navigation = useNavigation<DetalheNavProp>();
  const route = useRoute<DetalheRouteProp>();
  const { id } = route.params;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const dados = await servicoCliente.pegarPorIdentificao(id);
      setCliente(dados);
    } catch (erro: any) {
      exibir({
        titulo: "Erro",
        variante: "erro",
        descricao: erro.message || "Erro ao carregar cliente",
      });
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [id]),
  );

  const lidarComEdicao = () => {
    navigation.navigate(Routes.CadastroCliente, { id: cliente?.identificacao });
  };

  const confirmarDesativacao = () => {
    Alert.alert(
      "Confirmar Operação",
      `Deseja realmente desativar o cliente ${cliente?.nome}? Esta ação alterará o status para inativo no sistema.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desativar",
          style: "destructive",
          onPress: async () => {
            try {
              if (cliente) {
                await servicoCliente.desativar(cliente.identificacao);
                exibir({
                  titulo: "Cliente desativado com sucesso",
                  variante: "sucesso",
                });
                await carregarDados();
              }
            } catch (erro: any) {
              exibir({
                titulo: "Erro",
                descricao: erro.message,
                variante: "erro",
              });
            }
          },
        },
      ],
    );
  };

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: tema.cores.fundo.primario,
        }}
      >
        <ActivityIndicator size="large" color={tema.cores.marca.primario} />
      </View>
    );
  }

  if (!cliente) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={["left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          padding: tema.espacamento.md,
          gap: tema.espacamento.lg,
        }}
      >
        {/* Cabeçalho de Identificação */}
        <View style={{ gap: tema.espacamento.xs }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Texto variante="h1" cor="texto.primario">
              {cliente.nome}
            </Texto>
            <Badge
              variante={cliente.status === "ativo" ? "sucesso" : "neutro"}
              children={STATUS_PESSOA_LABEL[cliente.status]}
            />
          </View>
          <Texto variante="corpo" cor="texto.suave">
            CPF: {cliente.cpf}
          </Texto>
          <Texto variante="corpo" cor="texto.suave">
            ID: {cliente.identificacao}
          </Texto>
        </View>

        <Divisor />

        {/* Secção: Contactos */}
        <View style={{ gap: tema.espacamento.sm }}>
          <Texto variante="h3" cor="texto.primario">
            Contactos Telefónicos
          </Texto>
          {cliente.telefones && cliente.telefones.length > 0 ? (
            cliente.telefones.map((tel, index) => (
              <Texto key={index} variante="corpo" cor="texto.primario">
                • {tel}
              </Texto>
            ))
          ) : (
            <Texto variante="corpo" cor="texto.suave">
              Nenhum telefone registado.
            </Texto>
          )}
        </View>

        {/* Secção: Convénio (Renderização Condicional) */}
        <View style={{ gap: tema.espacamento.sm }}>
          <Texto variante="h3" cor="texto.primario">
            Plano de Saúde / Convénio
          </Texto>
          {cliente.convenio ? (
            <View
              style={{
                padding: tema.espacamento.md,
                backgroundColor: tema.cores.fundo.superficie,
                borderRadius: tema.raios.md,
                borderWidth: 1,
                borderColor: tema.cores.borda.padrao,
              }}
            >
              <Texto variante="corpo" cor="texto.primario" peso="negrito">
                {cliente.convenio.nome}
              </Texto>
              <Texto variante="legenda" cor="texto.suave">
                Registro ANS: {cliente.convenio.matricula}
              </Texto>
            </View>
          ) : (
            <Texto variante="corpo" cor="texto.suave">
              Atendimento Particular (Sem convénio registado)
            </Texto>
          )}
        </View>

        {/* Secção: Endereços (Mapeamento do Array) */}
        <View style={{ gap: tema.espacamento.sm }}>
          <Texto variante="h3" cor="texto.primario">
            Endereços Registados
          </Texto>
          {cliente.endereco ? (
            <View
              style={{
                padding: tema.espacamento.md,
                backgroundColor: tema.cores.fundo.superficie,
                borderRadius: tema.raios.md,
                marginBottom: tema.espacamento.xs,
              }}
            >
              <Texto variante="corpo" cor="texto.primario">
                {cliente.endereco.logradouro}, {cliente.endereco.numero}{" "}
                {cliente.endereco.complemento
                  ? `- ${cliente.endereco.complemento}`
                  : ""}
              </Texto>
              <Texto variante="legenda" cor="texto.suave">
                {cliente.endereco.bairro} — {cliente.endereco.cidade}/
                {cliente.endereco.estado}
              </Texto>
              <Texto variante="legenda" cor="texto.suave">
                CEP: {cliente.endereco.cep}
              </Texto>
            </View>
          ) : (
            <Texto variante="corpo" cor="texto.suave">
              Nenhum endereço cadastrado.
            </Texto>
          )}
        </View>

        {/* Ações de Gestão */}
        <View
          style={{
            gap: tema.espacamento.md,
            marginTop: tema.espacamento.xl,
            paddingBottom: tema.espacamento.xl,
          }}
        >
          <Botao
            rotulo="Editar Informações"
            onPress={lidarComEdicao}
            variante="primario"
          />
          {cliente.status === "ativo" && (
            <Botao
              rotulo="Desativar Cliente"
              onPress={confirmarDesativacao}
              variante="secundario"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
