import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, useWindowDimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTema } from "../../hooks/useTema";
import { Texto } from "../../components/ui";
import { useContextoConsulta } from "../../hooks/useContextoConsulta";
import { useToast } from "../../hooks/useToast";

// Importando as constantes atualizadas (ajuste o caminho se necessário)
import {
  STATUS_CONSULTA,
  TIPO_CONSULTA,
  TIPO_CONSULTA_LABEL
} from "../../constants/consulta";
import type { Consulta } from "../../types/models/consulta.type";

// Componentes da página
import { DadosAtendimento, AtendimentoForm } from "./componentes/AtendimentoForm";
import { HistoricoPaciente } from "./componentes/HistoricoPaciente";
import { PacienteConfirmadoItem } from "./componentes/PacienteConfirmadoItem";

/**
 * Mock: "médico atual" até EXT-02 (AuthContext expor médico logado).
 * Troque por useContextoAuth().medico.id quando disponível.
 */
const MEDICO_ATUAL_ID = "MED003";

function isMesmaData(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ─── Tipos de etapa ───────────────────────────────────────────────────────────

type Etapa =
  | { tipo: "lista" }
  | { tipo: "atendimento"; consulta: Consulta };

// ─── Tela principal ───────────────────────────────────────────────────────────

export function TelaRealizarConsulta() {
  const { tema } = useTema();
  const { state, realizarConsulta } = useContextoConsulta();
  const { exibir } = useToast();
  const { width } = useWindowDimensions();

  const [etapa, setEtapa] = useState<Etapa>({ tipo: "lista" });
  // O estado agora inclui a 'observacao' que adicionamos no form
  const [dadosForm, setDadosForm] = useState<DadosAtendimento>({ laudo: "", receita: "", observacao: "" });
  const [salvando, setSalvando] = useState(false);

  // Etapa A: consultas confirmadas do médico atual para hoje
  const confirmadosHoje = useMemo(() => {
    const hoje = new Date();
    return state.items
      .filter(
        (c) =>
          c.situacao === STATUS_CONSULTA.CONFIRMADA &&
          c.medico.matricula === MEDICO_ATUAL_ID &&
          isMesmaData(c.dataHora, hoje)
      )
      .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());
  }, [state.items]);

  // Etapa B: histórico do paciente em atendimento
  const historicoPaciente = useMemo(() => {
    if (etapa.tipo !== "atendimento") return [];
    const pacienteId = etapa.consulta.cliente.identificacao;

    return state.items
      .filter(
        (c) =>
          c.cliente.identificacao === pacienteId &&
          c.numero !== etapa.consulta.numero &&
          (c.situacao === STATUS_CONSULTA.REALIZADA ||
            c.situacao === STATUS_CONSULTA.ENCERRADA)
      )
      .sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
  }, [etapa, state.items]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const iniciarAtendimento = useCallback((consulta: Consulta) => {
    setDadosForm({ laudo: "", receita: "", observacao: "" });
    setEtapa({ tipo: "atendimento", consulta });
  }, []);

  const alterarCampo = useCallback(
    (campo: keyof DadosAtendimento, valor: string) => {
      setDadosForm((prev) => ({ ...prev, [campo]: valor }));
    },
    []
  );

  const finalizar = useCallback(async () => {
    if (etapa.tipo !== "atendimento") return;

    // --- NOVA VALIDAÇÃO OBRIGATÓRIA ---
    if (!dadosForm.laudo.trim() || !dadosForm.receita.trim()) {
      exibir({
        variante: "erro",
        titulo: "Campos Incompletos",
        descricao: "O preenchimento do Laudo e da Receita é obrigatório.",
      });
      return; // Interrompe a execução para não salvar
    }
    // -----------------------------------

    setSalvando(true);
    try {
      await realizarConsulta(etapa.consulta.numero, {
        laudo: dadosForm.laudo,
        receita: dadosForm.receita,
        // Caso a sua API suporte, passe também a observação
        // observacao: dadosForm.observacao
      });
      exibir({
        variante: "sucesso",
        titulo: "Consulta finalizada",
        descricao: `Atendimento de ${etapa.consulta.cliente.nome} registado.`,
      });
      setEtapa({ tipo: "lista" });
    } catch (e) {
      exibir({
        variante: "erro",
        titulo: "Erro ao finalizar",
        descricao: e instanceof Error ? e.message : "Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  }, [etapa, dadosForm, realizarConsulta, exibir]);

  const voltar = useCallback(() => {
    setEtapa({ tipo: "lista" });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={["left", "right"]}
    >
      {etapa.tipo === "lista" ? (
        // ── Etapa A: lista de confirmados ──────────────────────────────────
        <View style={{ flex: 1 }}>
          <View style={{ padding: tema.espacamento.md, gap: tema.espacamento.xs }}>
            <Texto variante="h1">Realizar Consulta</Texto>
            <Texto variante="legenda" cor="texto.suave">
              Pacientes confirmados para hoje
            </Texto>
          </View>

          <FlatList
            data={confirmadosHoje}
            keyExtractor={(item) => item.numero}
            renderItem={({ item }) => (
              <PacienteConfirmadoItem
                consulta={item}
                aoIniciarAtendimento={iniciarAtendimento}
              />
            )}
            contentContainerStyle={{
              padding: tema.espacamento.md,
              gap: tema.espacamento.sm,
              paddingBottom: 120,
            }}
            ListEmptyComponent={
              <View style={{ alignItems: "center", padding: tema.espacamento.xl }}>
                <Texto variante="corpo" cor="texto.suave">
                  Nenhum paciente confirmado para hoje.
                </Texto>
              </View>
            }
          />
        </View>
      ) : (
        // ── Etapa B: atendimento ───────────────────────────────────────────
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: tema.espacamento.md, gap: tema.espacamento.lg, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho do paciente */}
          <View style={{ gap: tema.espacamento.xs, paddingBottom: tema.espacamento.sm, borderBottomWidth: 1, borderColor: tema.cores.borda.padrao }}>
            <Texto variante="h1">{etapa.consulta.cliente.nome}</Texto>

            <Texto variante="legenda" cor="texto.suave">
              {/* Usando o TIPO_CONSULTA_LABEL para traduzir "retorno" para "Retorno" visualmente */}
              {TIPO_CONSULTA_LABEL[etapa.consulta.tipo]} · {etapa.consulta.dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </Texto>
          </View>

          {/* Formulario OBRIGATORIAMENTE ACIMA */}
          <AtendimentoForm
            valores={dadosForm}
            aoAlterar={alterarCampo}
            aoFinalizar={finalizar}
            aoVoltar={voltar}
            salvando={salvando}
          />

          {/* Linha Divisória */}
          <View style={{ height: 1, backgroundColor: tema.cores.borda.padrao, marginVertical: tema.espacamento.sm }} />

          {/* Histórico OBRIGATORIAMENTE ABAIXO */}
          <View style={{ gap: tema.espacamento.sm }}>
            <Texto variante="h2">Histórico do Paciente</Texto>
            <HistoricoPaciente
              consultas={historicoPaciente}
              largura={width - (tema.espacamento.md * 2)}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}