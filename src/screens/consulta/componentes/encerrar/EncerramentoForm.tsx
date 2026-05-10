import React, { useEffect } from "react";
import { Alert, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encerramentoSchema, EncerramentoFormData } from "./encerramentoSchema";
import { PROCEDIMENTOS } from "../../../../constants/procedimentos";
import {
  FORMA_PAGAMENTO,
  FORMA_PAGAMENTO_LABEL,
  TIPO_CONSULTA,
  TipoConsulta,
} from "../../../../constants/consulta";
import {
  Botao,
  EntradaTexto,
  EntradaSelect,
  CampoFormulario,
} from "../../../../components/ui";

interface EncerramentoFormProps {
  consultaNumero: string;
  tipoInicial: TipoConsulta;
  onSubmit: (data: EncerramentoFormData) => Promise<void>;
}

export const EncerramentoForm: React.FC<EncerramentoFormProps> = ({
  consultaNumero, // Mantido para caso você precise no futuro
  tipoInicial,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EncerramentoFormData>({
    resolver: zodResolver(encerramentoSchema),
    defaultValues: {
      tipo: tipoInicial, // Usa diretamente o tipo vindo das props
      procedimentos: [], // Zod exige pelo menos 1, será preenchido pelo usuário
      formaPagamento: FORMA_PAGAMENTO.DINHEIRO,
      valor: 0,
    },
    mode: "onChange",
  });

  const tipoConsulta = watch("tipo");

  // Regra crítica: se for retorno, zera o valor e muda pagamento para Isento
  useEffect(() => {
    if (tipoConsulta === TIPO_CONSULTA.RETORNO) {
      setValue("valor", 0, { shouldValidate: true, shouldDirty: true });
      setValue("formaPagamento", FORMA_PAGAMENTO.ISENTO, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [tipoConsulta, setValue]);

  return (
    <View style={{ gap: 16 }}>
      {/* 1. SELEÇÃO DE PROCEDIMENTOS (Obrigatório para o Zod passar) */}
      <Controller
        name="procedimentos"
        control={control}
        render={({ field }) => (
          <CampoFormulario
            rotulo="Procedimentos Realizados"
            erro={errors.procedimentos?.message}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {PROCEDIMENTOS.map((proc) => {
                const selecionado = field.value.includes(proc as never);
                return (
                  <Botao
                    key={proc}
                    rotulo={proc}
                    variante={selecionado ? "primario" : "secundario"}
                    tamanho="sm"
                    onPress={() => {
                      if (selecionado) {
                        field.onChange(field.value.filter((p) => p !== proc));
                      } else {
                        field.onChange([...field.value, proc]);
                      }
                    }}
                  />
                );
              })}
            </View>
          </CampoFormulario>
        )}
      />

      {/* 2. FORMA DE PAGAMENTO (Versão correta com Object.entries) */}
      <Controller
        name="formaPagamento"
        control={control}
        render={({ field }) => (
          <CampoFormulario
            rotulo="Forma de Pagamento"
            erro={errors.formaPagamento?.message}
          >
            <EntradaSelect
              valor={field.value}
              aoMudar={field.onChange}
              opcoes={Object.entries(FORMA_PAGAMENTO_LABEL).map(
                ([chave, label]) => ({
                  rotulo: label,
                  valor: chave,
                }),
              )}
              desabilitado={tipoConsulta === TIPO_CONSULTA.RETORNO}
            />
          </CampoFormulario>
        )}
      />

      {/* 3. VALOR DA CONSULTA */}
      <Controller
        name="valor"
        control={control}
        render={({ field }) => (
          <CampoFormulario rotulo="Valor (R$)" erro={errors.valor?.message}>
            <EntradaTexto
              keyboardType="numeric"
              value={field.value?.toString() || ""}
              onChangeText={(text) => {
                const num = parseFloat(text);
                field.onChange(isNaN(num) ? 0 : num);
              }}
              editable={tipoConsulta !== TIPO_CONSULTA.RETORNO}
            />
          </CampoFormulario>
        )}
      />

      {/* BOTÃO DE SUBMIT */}
      <View style={{ marginTop: 16 }}>
        <Botao
          rotulo="Encerrar Consulta"
          variante="primario"
          carregando={isSubmitting}
          onPress={handleSubmit(onSubmit, (erros) => {
            // Se cair aqui, a tela de alerta vai te dizer exatamente o porquê de estar falhando
            const camposComErro = Object.keys(erros).join(", ");
            Alert.alert(
              "Falha na Validação",
              `Os seguintes campos estão inválidos ou pendentes: ${camposComErro}`,
            );
          })}
          larguraTotal
        />
      </View>
    </View>
  );
};
