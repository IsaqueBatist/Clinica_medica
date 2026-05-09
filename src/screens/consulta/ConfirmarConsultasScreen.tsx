import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
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
  const { confirmarConsulta, recarregarConsultas } = useContextoConsulta();

  const [filtros, setFiltros] = useState<FiltrosListaConsulta>(
    FILTROS_LISTA_CONSULTA_VAZIOS,
  );
  const [modalFiltros, setModalFiltros] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

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
        renderItem={({ item }) => (
          <ConsultaConfirmavelItem
            consulta={item}
            aoConfirmar={() => aoConfirmar(item.numero)}
            carregandoConfirmar={confirmandoId === item.numero}
          />
        )}
      />
    </View>
  );
}
