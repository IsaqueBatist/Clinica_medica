import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";

// ─── 1. Tipagem e Interfaces ────────────────────────────────────────────────

export interface DadosAtendimento {
  laudo: string;
  receita: string;
  observacao: string;
}

interface PropsAtendimentoForm {
  valores: DadosAtendimento;
  aoAlterar: (campo: keyof DadosAtendimento, valor: string) => void;
  aoFinalizar: () => void;
  aoVoltar: () => void;
  aoCancelar: (motivo: "medico" | "falta") => void; // Nova prop
  salvando: boolean;
}

// Adicionada a propriedade 'obrigatorio'
interface PropsCampoTexto {
  rotulo: string;
  placeholder: string;
  valor: string;
  aoAlterar: (v: string) => void;
  desabilitado: boolean;
  acessibilidade: string;
  obrigatorio?: boolean;
}

// ─── 2. Componente de Campo de Texto ────────────────────────────────────────

function CampoTexto({
  rotulo,
  placeholder,
  valor,
  aoAlterar,
  desabilitado,
  acessibilidade,
  obrigatorio = false,
}: PropsCampoTexto) {
  const { tema } = useTema();
  const [focado, setFocado] = useState(false);

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            backgroundColor: tema.cores.marca.secundario,
          }}
        />
        <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.texto.secundario }}>
          {rotulo}
          {"  "}
          {obrigatorio ? (
            <Texto variante="legenda" style={{ color: tema.cores.status.erro, fontWeight: "bold" }}>
              *
            </Texto>
          ) : (
            <Texto variante="legenda" style={{ color: tema.cores.texto.suave, fontWeight: "400" }}>
              opcional
            </Texto>
          )}
        </Texto>
      </View>

      <TextInput
        style={{
          borderWidth: focado ? 1.5 : 1,
          borderColor: focado ? tema.cores.borda.foco : tema.cores.borda.padrao,
          borderRadius: tema.raios.md,
          padding: tema.espacamento.sm,
          paddingTop: tema.espacamento.sm,
          backgroundColor: desabilitado
            ? tema.cores.fundo.suave
            : tema.cores.fundo.superficie,
          color: tema.cores.texto.primario,
          minHeight: 110,
          textAlignVertical: "top",
          fontSize: 14,
          lineHeight: 20,
        }}
        placeholder={placeholder}
        placeholderTextColor={tema.cores.texto.suave}
        value={valor}
        onChangeText={aoAlterar}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        multiline
        editable={!desabilitado}
        accessibilityLabel={acessibilidade}
      />
    </View>
  );
}

// ─── 3. Componente Principal do Formulário ──────────────────────────────────

export function AtendimentoForm({
  valores,
  aoAlterar,
  aoFinalizar,
  aoVoltar,
  aoCancelar,
  salvando,
}: PropsAtendimentoForm) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <CampoTexto
        rotulo="Laudo"
        placeholder="Diagnóstico e observações clínicas..."
        valor={valores.laudo}
        aoAlterar={(v: string) => aoAlterar("laudo", v)}
        desabilitado={salvando}
        acessibilidade="Campo de laudo"
        obrigatorio={true}
      />

      <CampoTexto
        rotulo="Receita"
        placeholder="Medicamentos, dosagens e orientações..."
        valor={valores.receita}
        aoAlterar={(v: string) => aoAlterar("receita", v)}
        desabilitado={salvando}
        acessibilidade="Campo de receita"
        obrigatorio={true} // Marca como obrigatório
      />

      <CampoTexto
        rotulo="Observações"
        placeholder="Anotações complementares (opcional)..."
        valor={valores.observacao}
        aoAlterar={(v: string) => aoAlterar("observacao", v)}
        desabilitado={salvando}
        acessibilidade="Campo de observações"
        obrigatorio={false} // Mantém como opcional
      />

      {/* Ações */}
      {/* ─── Ações Principais (Fluxo Feliz) ─── */}
      <View style={{ gap: tema.espacamento.md, marginTop: tema.espacamento.sm }}>
        <TouchableOpacity
          onPress={aoFinalizar}
          disabled={salvando}
          activeOpacity={0.85}
          style={{
            width: "100%",
            paddingVertical: 16, // Área de toque maior
            borderRadius: tema.raios.md,
            backgroundColor: salvando ? tema.cores.borda.padrao : tema.cores.marca.primario,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: tema.espacamento.xs,
            elevation: 2, // Leve sombra para destacar o botão primário no Android
            shadowColor: "#000", // Sombra no iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          {salvando && <ActivityIndicator size="small" color="#ffffff" />}
          <Texto variante="corpo" peso="negrito" style={{ color: "#ffffff", fontSize: 16 }}>
            {salvando ? "Finalizando..." : "Finalizar Consulta"}
          </Texto>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={aoVoltar}
          disabled={salvando}
          activeOpacity={0.7}
          style={{
            width: "100%",
            paddingVertical: 14,
            borderRadius: tema.raios.md,
            borderWidth: 1.5,
            borderColor: tema.cores.borda.forte,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Texto variante="corpo" peso="medio" style={{ color: tema.cores.texto.secundario }}>
            Voltar para a lista
          </Texto>
        </TouchableOpacity>
      </View>

      {/* ─── Ações Destrutivas (Exceções) ─── */}
      <View style={{
        marginTop: tema.espacamento.xl,
        paddingTop: tema.espacamento.md,
        borderTopWidth: 1,
        borderColor: tema.cores.borda.padrao,
        gap: tema.espacamento.md
      }}>
        <View style={{ flexDirection: 'row', gap: tema.espacamento.sm }}>
          <TouchableOpacity
            onPress={() => aoCancelar("falta")}
            disabled={salvando}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: tema.raios.md,
              backgroundColor: tema.cores.fundo.primario, // Fundo sólido para quebrar a linha
              borderWidth: 1,
              borderColor: tema.cores.status.erro,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Texto variante="legenda" peso="negrito" style={{ color: tema.cores.status.erro, textAlign: 'center' }}>
              Falta do Paciente
            </Texto>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => aoCancelar("medico")}
            disabled={salvando}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: tema.raios.md,
              backgroundColor: tema.cores.fundo.primario,
              borderWidth: 1,
              borderColor: tema.cores.texto.secundario,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Texto variante="legenda" peso="negrito" cor="texto.secundario" style={{ textAlign: 'center' }}>
              Cancelar
            </Texto>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}