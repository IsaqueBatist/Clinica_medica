import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { medicosMock } from "../mocks/medicos";
import {
  STATUS_CONSULTA_LABEL,
  type SituacaoConsulta,
} from "../constants/consulta";
import {
  FILTROS_LISTA_CONSULTA_VAZIOS,
  type FiltrosListaConsulta,
} from "../utils/filters";
import { useTema } from "../hooks/useTema";
import { Botao } from "./ui/Botao";
import { CampoFormulario } from "./ui/CampoFormulario";
import { EntradaData, parsearDataBR } from "./ui/EntradaData";
import { EntradaSelect, type OpcaoSelect } from "./ui/EntradaSelect";
import { Texto } from "./ui/Texto";

export type ModoFiltrosConsulta = "completo" | "confirmacao";

export interface PropsFiltrosConsulta {
  visivel: boolean;
  aoFechar: () => void;
  valor: FiltrosListaConsulta;
  aoAplicar: (f: FiltrosListaConsulta) => void;
  modo?: ModoFiltrosConsulta;
}

const OPCAO_TODAS = "" as const;

const OP_STATUS: OpcaoSelect<string>[] = [
  { valor: OPCAO_TODAS, rotulo: "Todos" },
  ...(
    Object.keys(STATUS_CONSULTA_LABEL) as SituacaoConsulta[]
  ).map((s) => ({
    valor: s,
    rotulo: STATUS_CONSULTA_LABEL[s],
  })),
];

function cloneFiltros(f: FiltrosListaConsulta): FiltrosListaConsulta {
  return {
    especialidadeCodigo: f.especialidadeCodigo,
    medicoMatricula: f.medicoMatricula,
    situacao: f.situacao,
    dataInicio: f.dataInicio ? new Date(f.dataInicio) : undefined,
    dataFim: f.dataFim ? new Date(f.dataFim) : undefined,
  };
}

export function FiltrosConsulta({
  visivel,
  aoFechar,
  valor,
  aoAplicar,
  modo = "completo",
}: PropsFiltrosConsulta) {
  const { tema } = useTema();
  const [rascunho, setRascunho] = useState<FiltrosListaConsulta>(() =>
    cloneFiltros(valor),
  );
  const [dataInicioStr, setDataInicioStr] = useState("");
  const [dataFimStr, setDataFimStr] = useState("");

  useEffect(() => {
    if (visivel) {
      const v = cloneFiltros(valor);
      setRascunho(v);
      setDataInicioStr(
        v.dataInicio ? formatarDataBR(v.dataInicio) : "",
      );
      setDataFimStr(v.dataFim ? formatarDataBR(v.dataFim) : "");
    }
  }, [visivel, valor]);

  const opEspecialidades = useMemo((): OpcaoSelect<string>[] => {
    const map = new Map<string, string>();
    for (const m of medicosMock) {
      map.set(m.especialidade.codigo, m.especialidade.nome);
    }
    return [
      { valor: OPCAO_TODAS, rotulo: "Todas" },
      ...[...map.entries()].map(([codigo, nome]) => ({
        valor: codigo,
        rotulo: nome,
      })),
    ];
  }, []);

  const opMedicos = useMemo((): OpcaoSelect<string>[] => {
    let lista = medicosMock;
    if (rascunho.especialidadeCodigo) {
      lista = lista.filter(
        (m) => m.especialidade.codigo === rascunho.especialidadeCodigo,
      );
    }
    return [
      { valor: OPCAO_TODAS, rotulo: "Todos" },
      ...lista.map((m) => ({
        valor: m.matricula,
        rotulo: m.nome,
      })),
    ];
  }, [rascunho.especialidadeCodigo]);

  const completo = modo === "completo";

  function limpar() {
    setRascunho({ ...FILTROS_LISTA_CONSULTA_VAZIOS });
    setDataInicioStr("");
    setDataFimStr("");
  }

  function aplicar() {
    if (completo) {
      const inicio = parsearDataBR(dataInicioStr) ?? undefined;
      const fim = parsearDataBR(dataFimStr) ?? undefined;
      const base = cloneFiltros(rascunho);
      aoAplicar({
        ...base,
        dataInicio: inicio,
        dataFim: fim,
      });
    } else {
      aoAplicar({
        especialidadeCodigo: rascunho.especialidadeCodigo,
        medicoMatricula: rascunho.medicoMatricula,
      });
    }
    aoFechar();
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        onPress={aoFechar}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: tema.cores.fundo.superficie,
              borderTopLeftRadius: tema.raios.lg,
              borderTopRightRadius: tema.raios.lg,
              padding: tema.espacamento.lg,
              maxHeight: "88%",
            }}
          >
            <Texto variante="h3" peso="negrito">
              Filtros
            </Texto>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ marginTop: tema.espacamento.md }}
              contentContainerStyle={{ gap: tema.espacamento.md }}
            >
              <CampoFormulario rotulo="Especialidade">
                <EntradaSelect
                  valor={rascunho.especialidadeCodigo ?? OPCAO_TODAS}
                  opcoes={opEspecialidades}
                  aoMudar={(v) =>
                    setRascunho((s) => ({
                      ...s,
                      especialidadeCodigo: v || undefined,
                      medicoMatricula: undefined,
                    }))
                  }
                />
              </CampoFormulario>

              <CampoFormulario rotulo="Médico">
                <EntradaSelect
                  valor={rascunho.medicoMatricula ?? OPCAO_TODAS}
                  opcoes={opMedicos}
                  aoMudar={(v) =>
                    setRascunho((s) => ({
                      ...s,
                      medicoMatricula: v || undefined,
                    }))
                  }
                />
              </CampoFormulario>

              {completo ? (
                <>
                  <CampoFormulario rotulo="Status">
                    <EntradaSelect
                      valor={rascunho.situacao ?? OPCAO_TODAS}
                      opcoes={OP_STATUS}
                      aoMudar={(v) =>
                        setRascunho((s) => ({
                          ...s,
                          situacao: (v || undefined) as SituacaoConsulta | undefined,
                        }))
                      }
                    />
                  </CampoFormulario>
                  <CampoFormulario rotulo="Data inicial">
                    <EntradaData
                      valor={dataInicioStr}
                      aoMudar={setDataInicioStr}
                    />
                  </CampoFormulario>
                  <CampoFormulario rotulo="Data final">
                    <EntradaData valor={dataFimStr} aoMudar={setDataFimStr} />
                  </CampoFormulario>
                </>
              ) : null}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                gap: tema.espacamento.md,
                marginTop: tema.espacamento.lg,
              }}
            >
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Limpar"
                  variante="secundario"
                  larguraTotal
                  onPress={limpar}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Botao
                  rotulo="Aplicar"
                  variante="primario"
                  larguraTotal
                  onPress={aplicar}
                />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function formatarDataBR(d: Date): string {
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
