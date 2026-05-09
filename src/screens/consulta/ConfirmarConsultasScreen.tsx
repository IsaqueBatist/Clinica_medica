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
  useConsultasParaConfirmar,
  useContextoConsulta,
} from "../../hooks";
import { FiltrosConsulta } from "../../components/FiltrosConsulta";
import { Badge } from "../../components/ui/Badge";
import { Botao } from "../../components/ui/Botao";
import { BotaoIcone } from "../../components/ui/BotaoIcone";
import { Texto } from "../../components/ui/Texto";
import { EmptyState } from "../../components/feedback/EmptyState";
import type { DrawerParamList } from "../../navigation/types";
import {
  aplicarFiltrosConfirmacao,
  consultaPassou,
  countActiveFilters,
  FILTROS_LISTA_CONSULTA_VAZIOS,
  type FiltrosListaConsulta,
} from "../../utils/filters";
import { ConsultaConfirmavelItem } from "./components/ConsultaConfirmavelItem";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function ConfirmarConsultasScreen() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const toast = useToast();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const baseLista = useConsultasParaConfirmar();
  const {
    confirmarConsulta,
    cancelarPorNaoComparecimento,
    recarregarConsultas,
  } = useContextoConsulta();

  const [filtros, setFiltros] = useState<FiltrosListaConsulta>(
    FILTROS_LISTA_CONSULTA_VAZIOS,
  );
  const [modalFiltros, setModalFiltros] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [naoCompId, setNaoCompId] = useState<string | null>(null);
  const [modalNaoComp, setModalNaoComp] = useState<{
    numero: string;
  } | null>(null);

  const lista = useMemo(
    () =>
      aplicarFiltrosConfirmacao(baseLista, {
        especialidadeCodigo: filtros.especialidadeCodigo,
        medicoMatricula: filtros.medicoMatricula,
      }),
    [baseLista, filtros.especialidadeCodigo, filtros.medicoMatricula],
  );

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

  async function aoConfirmar(numero: string) {
    setConfirmandoId(numero);
    try {
      await confirmarConsulta(numero);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toast.exibir({
        variante: "sucesso",
        titulo: "Consulta confirmada",
        descricao: "Presença registrada.",
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível confirmar.";
      toast.exibir({ variante: "erro", titulo: "Erro", descricao: msg });
    } finally {
      setConfirmandoId(null);
    }
  }

  async function executarNaoCompareceu(numero: string) {
    setModalNaoComp(null);
    setNaoCompId(numero);
    try {
      await cancelarPorNaoComparecimento(numero);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toast.exibir({
        variante: "sucesso",
        titulo: "Não comparecimento",
        descricao: "Consulta atualizada.",
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível atualizar.";
      toast.exibir({ variante: "erro", titulo: "Erro", descricao: msg });
    } finally {
      setNaoCompId(null);
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
          Confirmar consultas
        </Texto>
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
            titulo="Tudo confirmado por aqui!"
            descricao="Não há consultas marcadas pendentes de confirmação para hoje."
          />
        }
        renderItem={({ item }) => {
          const passou = consultaPassou(item, new Date());
          return (
            <ConsultaConfirmavelItem
              consulta={item}
              aoConfirmar={() => aoConfirmar(item.numero)}
              mostrarNaoCompareceu={passou}
              aoNaoCompareceu={
                passou
                  ? () => setModalNaoComp({ numero: item.numero })
                  : undefined
              }
              carregandoConfirmar={confirmandoId === item.numero}
              carregandoNaoCompareceu={naoCompId === item.numero}
            />
          );
        }}
      />

      <Modal
        visible={!!modalNaoComp}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNaoComp(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: tema.espacamento.lg,
          }}
          onPress={() => setModalNaoComp(null)}
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
              Marcar não comparecimento?
            </Texto>
            <Texto variante="corpo" cor="texto.secundario">
              A consulta será registrada como cancelada por não comparecimento.
            </Texto>
            <View style={{ flexDirection: "row", gap: tema.espacamento.sm }}>
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Voltar"
                  variante="secundario"
                  larguraTotal
                  onPress={() => setModalNaoComp(null)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Confirmar"
                  variante="perigo"
                  larguraTotal
                  onPress={() =>
                    modalNaoComp &&
                    executarNaoCompareceu(modalNaoComp.numero)
                  }
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
