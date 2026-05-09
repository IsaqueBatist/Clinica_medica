import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import {
  useConsultasParaCancelarPeloCliente,
  useContextoConsulta,
} from "../../hooks";
import { FiltrosConsulta } from "../../components/FiltrosConsulta";
import { Badge } from "../../components/ui/Badge";
import { Botao } from "../../components/ui/Botao";
import { BotaoIcone } from "../../components/ui/BotaoIcone";
import { EntradaTexto } from "../../components/ui/EntradaTexto";
import { Texto } from "../../components/ui/Texto";
import { EmptyState } from "../../components/feedback/EmptyState";
import type { DrawerParamList } from "../../navigation/types";
import {
  aplicarFiltrosConfirmacao,
  countActiveFilters,
  FILTROS_LISTA_CONSULTA_VAZIOS,
  type FiltrosListaConsulta,
} from "../../utils/filters";
import { ConsultaCancelavelItem } from "./components/ConsultaCancelavelItem";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function CancelarConsultasScreen() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const toast = useToast();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const baseLista = useConsultasParaCancelarPeloCliente();
  const { cancelarConsultaPeloCliente, recarregarConsultas } =
    useContextoConsulta();

  const [filtros, setFiltros] = useState<FiltrosListaConsulta>(
    FILTROS_LISTA_CONSULTA_VAZIOS,
  );
  const [busca, setBusca] = useState("");
  const [modalFiltros, setModalFiltros] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [modalCancelar, setModalCancelar] = useState<{
    numero: string;
  } | null>(null);
  const [motivo, setMotivo] = useState("");

  const lista = useMemo(() => {
    const filtrada = aplicarFiltrosConfirmacao(baseLista, {
      especialidadeCodigo: filtros.especialidadeCodigo,
      medicoMatricula: filtros.medicoMatricula,
    });
    const termo = busca.trim().toLowerCase();
    if (!termo) return filtrada;
    return filtrada.filter((c) =>
      c.cliente.nome.toLowerCase().includes(termo),
    );
  }, [baseLista, filtros.especialidadeCodigo, filtros.medicoMatricula, busca]);

  const nAtivos = countActiveFilters({
    especialidadeCodigo: filtros.especialidadeCodigo,
    medicoMatricula: filtros.medicoMatricula,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await recarregarConsultas();
    } finally {
      setRefreshing(false);
    }
  }, [recarregarConsultas]);

  function abrirModalCancelar(numero: string) {
    setMotivo("");
    setModalCancelar({ numero });
  }

  async function executarCancelamento() {
    if (!modalCancelar) return;
    if (!motivo.trim()) {
      toast.exibir({
        variante: "erro",
        titulo: "Motivo obrigatório",
        descricao: "Informe o motivo informado pelo paciente.",
      });
      return;
    }
    const numero = modalCancelar.numero;
    setCancelandoId(numero);
    try {
      await cancelarConsultaPeloCliente(numero, {
        motivoCancelamento: motivo.trim(),
      });
      setModalCancelar(null);
      setMotivo("");
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toast.exibir({
        variante: "sucesso",
        titulo: "Cancelamento registrado",
        descricao: "O horário volta a ficar disponível na agenda.",
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível cancelar.";
      toast.exibir({ variante: "erro", titulo: "Erro", descricao: msg });
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          paddingVertical: tema.espacamento.sm,
          backgroundColor: tema.cores.fundo.superficie,
          borderBottomWidth: 1,
          borderBottomColor: tema.cores.borda.padrao,
        }}
      >
        <BotaoIcone
          nomeIcone="menu"
          rotuloAcessivel="Abrir menu"
          variante="neutro"
          tamanho={20}
          onPress={() => navigation.openDrawer()}
        />
        <Texto variante="corpo" peso="negrito" style={{ flex: 1 }}>
          Cancelar consulta
        </Texto>
      </View>

      <View
        style={{
          paddingHorizontal: tema.espacamento.md,
          paddingTop: tema.espacamento.md,
        }}
      >
        <EntradaTexto
          placeholder="Buscar pelo nome do paciente"
          value={busca}
          onChangeText={setBusca}
          iconeEsquerda="busca"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          padding: tema.espacamento.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Botao
            rotulo="Filtros"
            variante="secundario"
            larguraTotal
            onPress={() => setModalFiltros(true)}
          />
        </View>
        {nAtivos > 0 ? (
          <Badge variante="info">{String(nAtivos)}</Badge>
        ) : null}
      </View>

      <FiltrosConsulta
        visivel={modalFiltros}
        aoFechar={() => setModalFiltros(false)}
        valor={filtros}
        modo="confirmacao"
        aoAplicar={setFiltros}
      />

      <FlatList
        data={lista}
        keyExtractor={(item) => item.numero}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          padding: tema.espacamento.md,
          gap: tema.espacamento.md,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <EmptyState
            titulo="Nada para cancelar hoje"
            descricao="Não há consultas marcadas ou confirmadas elegíveis para cancelamento pelo paciente nesta data."
          />
        }
        renderItem={({ item }) => (
          <ConsultaCancelavelItem
            consulta={item}
            aoCancelar={() => abrirModalCancelar(item.numero)}
            carregando={cancelandoId === item.numero}
          />
        )}
      />

      <Modal
        visible={!!modalCancelar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCancelar(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: tema.espacamento.lg,
          }}
          onPress={() => setModalCancelar(null)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: tema.cores.fundo.superficie,
              borderRadius: tema.raios.lg,
              padding: tema.espacamento.lg,
              gap: tema.espacamento.md,
            }}
          >
            <Texto variante="h3" peso="negrito">
              Cancelar consulta a pedido do paciente?
            </Texto>
            <Texto variante="corpo" cor="texto.secundario">
              O cancelamento será registrado com o motivo abaixo. O horário
              fica liberado para nova marcação.
            </Texto>
            <EntradaTexto
              placeholder="Motivo informado pelo paciente"
              value={motivo}
              onChangeText={setMotivo}
              multiline
            />
            <View style={{ flexDirection: "row", gap: tema.espacamento.sm }}>
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Voltar"
                  variante="secundario"
                  larguraTotal
                  onPress={() => setModalCancelar(null)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Confirmar cancelamento"
                  variante="perigo"
                  larguraTotal
                  carregando={
                    !!modalCancelar && cancelandoId === modalCancelar.numero
                  }
                  onPress={executarCancelamento}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
