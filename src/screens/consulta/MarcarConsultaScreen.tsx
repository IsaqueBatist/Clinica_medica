import { useCallback, useReducer, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import { useContextoConsulta } from "../../hooks";
import { BotaoIcone } from "../../components/ui/BotaoIcone";
import { Botao } from "../../components/ui/Botao";
import { Texto } from "../../components/ui/Texto";
import type { DrawerParamList } from "../../navigation/types";
import {
  ESTADO_INICIAL,
  podeAvancar,
  reducerMarcacao,
} from "./marcacaoReducer";
import { StepCliente } from "./components/marcacao/StepCliente";
import { StepMedico } from "./components/marcacao/StepMedico";
import { StepAgenda } from "./components/marcacao/StepAgenda";
import { StepResumo } from "./components/marcacao/StepResumo";

const TITULO_STEP = {
  cliente: "1 de 4 · Cliente",
  medico: "2 de 4 · Médico",
  agenda: "3 de 4 · Agenda",
  resumo: "4 de 4 · Resumo",
} as const;

export function MarcarConsultaScreen() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const navigation =
    useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const toast = useToast();
  const { marcarConsulta } = useContextoConsulta();

  const [state, dispatch] = useReducer(reducerMarcacao, ESTADO_INICIAL);
  const [confirmando, setConfirmando] = useState(false);

  // Drawer mantém a tela montada entre navegações, então o reducer preservaria
  // o último wizard. Resetar no foco garante fluxo novo a cada entrada.
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "RESET" });
    }, []),
  );

  async function confirmar() {
    if (
      !state.cliente ||
      !state.medico ||
      !state.dataHora ||
      !state.tipo
    ) {
      return;
    }
    setConfirmando(true);
    try {
      await marcarConsulta({
        cliente: state.cliente,
        medico: state.medico,
        dataHora: state.dataHora,
        tipo: state.tipo,
      });
      toast.exibir({
        variante: "sucesso",
        titulo: "Consulta marcada",
        descricao: `${state.cliente.nome} com ${state.medico.nome}.`,
      });
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao marcar consulta.";
      toast.exibir({ variante: "erro", titulo: "Erro", descricao: msg });
    } finally {
      setConfirmando(false);
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
          Marcar consulta
        </Texto>
        <Texto variante="legenda" cor="texto.secundario">
          {TITULO_STEP[state.step]}
        </Texto>
      </View>

      <View style={{ flex: 1 }}>
        {state.step === "cliente" && (
          <StepCliente state={state} dispatch={dispatch} />
        )}
        {state.step === "medico" && (
          <StepMedico state={state} dispatch={dispatch} />
        )}
        {state.step === "agenda" && (
          <StepAgenda state={state} dispatch={dispatch} />
        )}
        {state.step === "resumo" && (
          <StepResumo state={state} dispatch={dispatch} />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: tema.espacamento.md,
          padding: tema.espacamento.lg,
          paddingBottom: tema.espacamento.lg + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: tema.cores.borda.padrao,
          backgroundColor: tema.cores.fundo.superficie,
        }}
      >
        {state.step !== "cliente" && (
          <Botao
            rotulo="Voltar"
            variante="secundario"
            onPress={() => dispatch({ type: "VOLTAR" })}
            disabled={confirmando}
          />
        )}
        <View style={{ flex: 1 }}>
          {state.step !== "resumo" ? (
            <Botao
              rotulo="Próximo"
              larguraTotal
              onPress={() => dispatch({ type: "AVANCAR" })}
              disabled={!podeAvancar(state)}
            />
          ) : (
            <Botao
              rotulo="Confirmar"
              larguraTotal
              carregando={confirmando}
              disabled={!state.tipo}
              onPress={confirmar}
            />
          )}
        </View>
      </View>
    </View>
  );
}
