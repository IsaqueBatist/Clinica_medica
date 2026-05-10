import React, { useState, useMemo, useCallback } from "react";
import { ScrollView, RefreshControl, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Texto } from "../../components";
import { useTema, useContextoConsulta } from "../../hooks";
import { AtalhosRapidos } from "./components/AtalhosRapidos";
import { PeriodoFilter } from "./components/FiltroPeriodo";
import { SaudacaoHeader } from "./components/Saudacao";
import {
  Periodo,
  filtrarPorPeriodo,
  consultasPorStatus,
  faturamentoPeriodo,
  taxaNoShow,
  topMedicos,
  totalConsultasPeriodo,
} from "../../types/stats";
import { STATUS_CONSULTA } from "../../constants/consulta";

// ─── Subcomponentes ────────────────────────────────────────────────────────────

interface PropsCardMetrica {
  rotulo: string;
  valor: string;
  sub?: string;
  destaque?: boolean;
  corValor?: string;
}

function CardMetrica({ rotulo, valor, sub, destaque, corValor }: PropsCardMetrica) {
  const { tema } = useTema();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.superficie,
        borderRadius: tema.raios.lg,
        borderWidth: destaque ? 0 : 1,
        borderColor: tema.cores.borda.padrao,
        borderLeftWidth: destaque ? 3 : 1,
        borderLeftColor: destaque ? tema.cores.marca.primario : tema.cores.borda.padrao,
        padding: 14,
        gap: 4,
      }}
    >
      <Texto
        variante="legenda"
        style={{
          fontSize: 11,
          color: tema.cores.texto.suave,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {rotulo}
      </Texto>
      <Texto
        variante="h2"
        style={{
          fontSize: 22,
          fontWeight: "500",
          color: corValor ?? tema.cores.texto.primario,
          lineHeight: 26,
        }}
      >
        {valor}
      </Texto>
      {sub ? (
        <Texto variante="legenda" style={{ fontSize: 11, color: tema.cores.texto.suave }}>
          {sub}
        </Texto>
      ) : null}
    </View>
  );
}

interface PropsBadgeStatus {
  rotulo: string;
  variante: "marcada" | "confirmada" | "realizada" | "encerrada" | "falta";
}

function BadgeStatus({ rotulo, variante }: PropsBadgeStatus) {
  const { tema } = useTema();

  const estilos: Record<string, { bg: string; texto: string }> = {
    marcada: { bg: tema.cores.fundo.suave, texto: tema.cores.texto.suave },
    confirmada: { bg: "#e1f5ee", texto: "#085041" },
    realizada: { bg: tema.cores.marca.primario + "18", texto: tema.cores.marca.primario },
    encerrada: { bg: tema.cores.status.sucesso + "18", texto: tema.cores.status.sucesso },
    falta: { bg: tema.cores.status.erro + "18", texto: tema.cores.status.erro },
  };

  const { bg, texto } = estilos[variante];

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 99,
        backgroundColor: bg,
      }}
    >
      <Texto variante="legenda" style={{ fontSize: 12, fontWeight: "600", color: texto }}>
        {rotulo}
      </Texto>
    </View>
  );
}

// ─── Tela principal ────────────────────────────────────────────────────────────

export function Dashboard() {
  const { tema } = useTema();
  const { state, recarregarConsultas } = useContextoConsulta();
  const [periodoDashboard, setPeriodoDashboard] = useState<Periodo>("hoje");

  const onRefresh = useCallback(() => {
    recarregarConsultas();
  }, [recarregarConsultas]);

  const dadosDashboard = useMemo(() => {
    const consultasFiltradas = filtrarPorPeriodo(state.items, periodoDashboard);
    const porStatus = consultasPorStatus(consultasFiltradas);

    // Denominador real do no-show (só quem chegou ao dia)
    const noDia =
      (porStatus[STATUS_CONSULTA.CONFIRMADA] ?? 0) +
      (porStatus[STATUS_CONSULTA.REALIZADA] ?? 0) +
      (porStatus[STATUS_CONSULTA.ENCERRADA] ?? 0) +
      (porStatus[STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO] ?? 0);

    const faltas = porStatus[STATUS_CONSULTA.CANCELADA_POR_NAO_COMPARECIMENTO] ?? 0;

    return {
      status: porStatus,
      faturamento: faturamentoPeriodo(consultasFiltradas),
      noShow: taxaNoShow(consultasFiltradas),
      noShowFracao: noDia > 0 ? `${faltas} de ${noDia} pacientes` : "sem dados",
      topMedicos: topMedicos(consultasFiltradas, 3),
      total: totalConsultasPeriodo(consultasFiltradas),
      confirmados: porStatus[STATUS_CONSULTA.CONFIRMADA] ?? 0,
      marcadas: porStatus[STATUS_CONSULTA.MARCADA] ?? 0,
      realizadas: porStatus[STATUS_CONSULTA.REALIZADA] ?? 0,
      encerradas: porStatus[STATUS_CONSULTA.ENCERRADA] ?? 0,
      faltas,
    };
  }, [state.items, periodoDashboard]);

  if (!state.loading && state.items.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: tema.cores.fundo.primario,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Texto variante="h1" style={{ textAlign: "center", marginBottom: 16 }}>
          Bem-vindo à Clínica!
        </Texto>
        <Texto variante="corpo" cor="texto.suave" style={{ textAlign: "center", marginBottom: 32 }}>
          Parece que ainda não tem nenhuma consulta agendada.
        </Texto>
        <AtalhosRapidos />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          padding: tema.espacamento.md,
          paddingBottom: 100,
          gap: tema.espacamento.lg,
        }}
        refreshControl={
          <RefreshControl
            refreshing={state.loading}
            onRefresh={onRefresh}
            colors={[tema.cores.marca.primario]}
            tintColor={tema.cores.marca.primario}
          />
        }
      >
        {/* Cabeçalho */}
        <SaudacaoHeader />

        {/* Seção dashboard */}
        <View style={{ gap: tema.espacamento.md }}>
          <Texto variante="h2">Dashboard</Texto>

          {/* Filtro de período */}
          <PeriodoFilter periodoAtivo={periodoDashboard} aoMudar={setPeriodoDashboard} />

          {/* Linha 1: Faturamento (destaque) + Agendamentos */}
          <View style={{ flexDirection: "row", gap: tema.espacamento.sm }}>
            <CardMetrica
              rotulo="Faturamento"
              valor={`R$ ${dadosDashboard.faturamento.toFixed(2)}`}
              sub="consultas encerradas"
              destaque
            />
            <CardMetrica
              rotulo="Agendamentos"
              valor={String(dadosDashboard.total)}
              sub="total no período"
            />
          </View>

          {/* Linha 2: Confirmados + Não comparecimento */}
          <View style={{ flexDirection: "row", gap: tema.espacamento.sm }}>
            <CardMetrica
              rotulo="Confirmados"
              valor={String(dadosDashboard.confirmados)}
              sub="aguardando atendimento"
            />
            <CardMetrica
              rotulo="Não comparecimento"
              valor={`${dadosDashboard.noShow.toFixed(1)}%`}
              sub={dadosDashboard.noShowFracao}
              corValor={
                dadosDashboard.noShow > 20
                  ? tema.cores.status.erro
                  : tema.cores.texto.primario
              }
            />
          </View>

          {/* Status do dia */}
          <View
            style={{
              backgroundColor: tema.cores.fundo.superficie,
              borderRadius: tema.raios.lg,
              borderWidth: 1,
              borderColor: tema.cores.borda.padrao,
              padding: 14,
              gap: 10,
            }}
          >
            <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.texto.secundario }}>
              Status do dia
            </Texto>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {dadosDashboard.marcadas > 0 && (
                <BadgeStatus rotulo={`${dadosDashboard.marcadas} marcada${dadosDashboard.marcadas > 1 ? "s" : ""}`} variante="marcada" />
              )}
              {dadosDashboard.confirmados > 0 && (
                <BadgeStatus rotulo={`${dadosDashboard.confirmados} confirmada${dadosDashboard.confirmados > 1 ? "s" : ""}`} variante="confirmada" />
              )}
              {dadosDashboard.realizadas > 0 && (
                <BadgeStatus rotulo={`${dadosDashboard.realizadas} realizada${dadosDashboard.realizadas > 1 ? "s" : ""}`} variante="realizada" />
              )}
              {dadosDashboard.encerradas > 0 && (
                <BadgeStatus rotulo={`${dadosDashboard.encerradas} encerrada${dadosDashboard.encerradas > 1 ? "s" : ""}`} variante="encerrada" />
              )}
              {dadosDashboard.faltas > 0 && (
                <BadgeStatus rotulo={`${dadosDashboard.faltas} falta${dadosDashboard.faltas > 1 ? "s" : ""}`} variante="falta" />
              )}
            </View>
          </View>

          {/* Top médicos */}
          {dadosDashboard.topMedicos.length > 0 && (
            <View
              style={{
                backgroundColor: tema.cores.fundo.superficie,
                borderRadius: tema.raios.lg,
                borderWidth: 1,
                borderColor: tema.cores.borda.padrao,
                padding: 14,
                gap: 2,
              }}
            >
              <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.texto.secundario }}>
                  Top médicos
                </Texto>
                <Texto variante="legenda" style={{ fontSize: 11, color: tema.cores.texto.suave }}>
                  {periodoDashboard}
                </Texto>
              </View>

              {dadosDashboard.topMedicos.map((med, i) => (
                <View
                  key={med.medicoId}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                    borderBottomWidth: i < dadosDashboard.topMedicos.length - 1 ? 1 : 0,
                    borderBottomColor: tema.cores.borda.padrao,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Texto variante="legenda" style={{ fontSize: 11, color: tema.cores.texto.suave, minWidth: 16 }}>
                      {i + 1}.
                    </Texto>
                    <Texto variante="corpo" style={{ color: tema.cores.texto.primario }}>
                      {med.nome}
                    </Texto>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 99,
                      backgroundColor: tema.cores.marca.primario + "18",
                    }}
                  >
                    <Texto
                      variante="legenda"
                      style={{ fontSize: 12, fontWeight: "600", color: tema.cores.marca.primario }}
                    >
                      {med.count} atend.
                    </Texto>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Divisor */}
        <View style={{ height: 1, backgroundColor: tema.cores.borda.padrao }} />

        {/* Ações rápidas */}
        <View style={{ gap: tema.espacamento.md }}>
          <Texto variante="h2">Ações rápidas</Texto>
          <AtalhosRapidos />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}