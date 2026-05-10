import React, { useContext, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import {
  clienteCadastroSchema,
  clienteEdicaoSchema,
  ClienteCadastroFormValues,
  ClienteEdicaoFormValues,
} from "./ClienteFormSchema";

import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import { ContextoCliente } from "../../contexts/ContextoCliente";

import { ClientesStackParamList } from "../../navigation/types";

import {
  Texto,
  Botao,
  EntradaTexto,
  Card,
  Avatar,
  Icone,
  CampoFormulario,
} from "../../components/ui";

import {
  CadastrarClienteDTO,
  EditarClienteDTO,
} from "../../types/services/ClienteService.service.type";

const mascaraTelefone = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

const mascaraCPF = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .substring(0, 14);
};

const mascaraData = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .substring(0, 10);
};

const converterData = (data?: string): Date | undefined => {
  if (!data) return undefined;
  const [dia, mes, ano] = data.split("/");
  if (!dia || !mes || !ano) {
    return undefined;
  }
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
};

type FormValues = ClienteCadastroFormValues | ClienteEdicaoFormValues;

// Tipagem rigorosa para garantir a leitura do id
type CadastroRouteProp = RouteProp<ClientesStackParamList, "CadastroCliente">;

export function TelaFormularioClientes() {
  const { tema } = useTema();
  const toast = useToast();
  const navigation = useNavigation<any>();

  // Extração estrita do ID via React Navigation
  const route = useRoute<CadastroRouteProp>();
  const idDaRota = route.params?.id;

  const clienteCtx = useContext(ContextoCliente);

  const isEdicao = !!idDaRota;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(
      isEdicao ? clienteEdicaoSchema : clienteCadastroSchema,
    ),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      dataNascimento: "",
      endereco: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
      convenio: {
        nome: "",
        matricula: "",
      },
    } as any,
  });

  useEffect(() => {
    if (!isEdicao || !idDaRota || !clienteCtx) {
      return;
    }

    const cliente = clienteCtx.state.items.find(
      (c) => c.identificacao === idDaRota,
    );

    if (!cliente) {
      return;
    }

    reset({
      nome: cliente.nome || "",
      telefone: cliente.telefones?.[0] || "",
      email: cliente.email || "",
      dataNascimento: cliente.dataNascimento
        ? new Date(cliente.dataNascimento).toLocaleDateString("pt-BR")
        : "",
      endereco: {
        logradouro: cliente.endereco?.logradouro || "",
        numero: cliente.endereco?.numero || "",
        complemento: cliente.endereco?.complemento || "",
        bairro: cliente.endereco?.bairro || "",
        cidade: cliente.endereco?.cidade || "",
        estado: cliente.endereco?.estado || "",
      },
      convenio: {
        nome: cliente.convenio?.nome || "",
        matricula: cliente.convenio?.matricula || "",
      },
    } as any);
  }, [clienteCtx, idDaRota, isEdicao, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!clienteCtx) {
      return;
    }

    try {
      if (!isEdicao) {
        const dto: CadastrarClienteDTO = {
          nome: data.nome,
          cpf: (data as ClienteCadastroFormValues).cpf.replace(/\D/g, ""),
          telefones: [data.telefone],
        };

        await clienteCtx.criarCliente(dto);

        toast.exibir({
          variante: "sucesso",
          titulo: "Cliente cadastrado com sucesso!",
        });

        navigation.goBack();
        return;
      }

      // ==========================================
      // EDIÇÃO
      // ==========================================

      const clienteExistente = clienteCtx.state.items.find(
        (c) => c.identificacao === idDaRota,
      );

      const dataEdicao = data as ClienteEdicaoFormValues;

      const convenio =
        dataEdicao.convenio?.nome && dataEdicao.convenio?.matricula
          ? {
              nome: dataEdicao.convenio.nome,
              matricula: dataEdicao.convenio.matricula,
            }
          : undefined;

      const dto: EditarClienteDTO = {
        nome: dataEdicao.nome,
        email: dataEdicao.email,
        dataNascimento: converterData(dataEdicao.dataNascimento) as any,
        status: clienteExistente?.status ?? "ativo",
        telefones: [dataEdicao.telefone],
        endereco: clienteExistente?.endereco
          ? {
              ...clienteExistente.endereco,
              logradouro: dataEdicao.endereco?.logradouro || "",
              numero: dataEdicao.endereco?.numero || "",
              complemento: dataEdicao.endereco?.complemento,
              bairro: dataEdicao.endereco?.bairro || "",
              cidade: dataEdicao.endereco?.cidade || "",
              estado: dataEdicao.endereco?.estado || "",
            }
          : undefined,
        convenio,
      };

      await clienteCtx.atualizarCliente(idDaRota!, dto);

      toast.exibir({
        variante: "sucesso",
        titulo: "Cliente atualizado com sucesso!",
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);

      toast.exibir({
        variante: "erro",
        titulo: "Erro ao salvar cliente.",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: tema.espacamento.md,
            paddingBottom: 120,
          }}
        >
          <Card
            style={{
              padding: tema.espacamento.md,
              gap: tema.espacamento.md,
            }}
          >
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Texto variante="h3" peso="medio">
                Dados Pessoais
              </Texto>
              <Icone nome={"usuario" as any} tamanho={24} />
            </View>

            {/* ID */}
            {isEdicao && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tema.espacamento.sm,
                }}
              >
                <Texto cor="texto.secundario">{idDaRota}</Texto>
                <Avatar nome="" />
              </View>
            )}

            {/* NOME */}
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <CampoFormulario
                  rotulo="Nome"
                  erro={errors.nome?.message as string}
                >
                  <EntradaTexto value={value} onChangeText={onChange} />
                </CampoFormulario>
              )}
            />

            {/* CPF */}
            {!isEdicao && (
              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, value } }) => (
                  <CampoFormulario
                    rotulo="CPF"
                    erro={(errors as any)?.cpf?.message}
                  >
                    <EntradaTexto
                      tipo="numero"
                      value={value}
                      onChangeText={(t) => onChange(mascaraCPF(t))}
                    />
                  </CampoFormulario>
                )}
              />
            )}

            {/* DATA */}
            {isEdicao && (
              <Controller
                control={control}
                name="dataNascimento"
                render={({ field: { onChange, value } }) => (
                  <CampoFormulario
                    rotulo="Data de Nascimento"
                    erro={(errors as any)?.dataNascimento?.message}
                  >
                    <EntradaTexto
                      tipo="numero"
                      placeholder="DD/MM/AAAA"
                      value={value}
                      onChangeText={(t) => onChange(mascaraData(t))}
                    />
                  </CampoFormulario>
                )}
              />
            )}

            {/* EMAIL */}
            {isEdicao && (
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <CampoFormulario
                    rotulo="E-mail"
                    erro={(errors as any)?.email?.message}
                  >
                    <EntradaTexto
                      tipo="email"
                      value={value}
                      onChangeText={onChange}
                    />
                  </CampoFormulario>
                )}
              />
            )}

            {/* TELEFONE */}
            <Controller
              control={control}
              name="telefone"
              render={({ field: { onChange, value } }) => (
                <CampoFormulario
                  rotulo="Telefone"
                  erro={errors.telefone?.message as string}
                >
                  <EntradaTexto
                    tipo="telefone"
                    placeholder="(11) 99999-9999"
                    value={value}
                    onChangeText={(t) => onChange(mascaraTelefone(t))}
                  />
                </CampoFormulario>
              )}
            />

            {/* ENDEREÇO */}
            {isEdicao && (
              <>
                <Texto variante="h3" peso="medio">
                  Endereço
                </Texto>

                <Controller
                  control={control}
                  name="endereco.logradouro"
                  render={({ field: { onChange, value } }) => (
                    <CampoFormulario rotulo="Logradouro">
                      <EntradaTexto value={value} onChangeText={onChange} />
                    </CampoFormulario>
                  )}
                />

                <Controller
                  control={control}
                  name="endereco.numero"
                  render={({ field: { onChange, value } }) => (
                    <CampoFormulario rotulo="Número">
                      <EntradaTexto value={value} onChangeText={onChange} />
                    </CampoFormulario>
                  )}
                />

                <Controller
                  control={control}
                  name="endereco.bairro"
                  render={({ field: { onChange, value } }) => (
                    <CampoFormulario rotulo="Bairro">
                      <EntradaTexto value={value} onChangeText={onChange} />
                    </CampoFormulario>
                  )}
                />

                <Controller
                  control={control}
                  name="endereco.cidade"
                  render={({ field: { onChange, value } }) => (
                    <CampoFormulario rotulo="Cidade">
                      <EntradaTexto value={value} onChangeText={onChange} />
                    </CampoFormulario>
                  )}
                />

                <Controller
                  control={control}
                  name="endereco.estado"
                  render={({ field: { onChange, value } }) => (
                    <CampoFormulario rotulo="UF">
                      <EntradaTexto
                        value={value}
                        maxLength={2}
                        autoCapitalize="characters"
                        onChangeText={onChange}
                      />
                    </CampoFormulario>
                  )}
                />
              </>
            )}

            {/* BOTÕES */}
            <View
              style={{
                gap: tema.espacamento.sm,
                marginTop: tema.espacamento.md,
              }}
            >
              <Botao
                rotulo={isEdicao ? "Atualizar Cliente" : "Cadastrar Cliente"}
                iconeDireita={"check" as any}
                carregando={isSubmitting}
                onPress={handleSubmit(onSubmit, (erros) => {
                  console.log("ERROS:", erros);
                  toast.exibir({
                    variante: "erro",
                    titulo: "Preencha os campos obrigatórios.",
                  });
                })}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
