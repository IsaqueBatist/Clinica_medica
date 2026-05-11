import React, { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTema } from '../../hooks/useTema';
import { Texto, Botao, EntradaTexto, Card, CampoFormulario } from '../../components/ui';
import { useContextoMedico } from '../../hooks/useContextoMedico';
import { MedicosStackParamList } from '../../navigation/types';
import { Routes } from '../../constants/routes';
import { medicoFormSchema, MedicoFormValues } from './MedicoFormSchema';

export function TelaFormularioMedico() {
    const { tema } = useTema();
    const route = useRoute<RouteProp<MedicosStackParamList, typeof Routes.CadastroMedico>>();
    const navigation = useNavigation<NativeStackNavigationProp<MedicosStackParamList>>();
    const { state, criarMedico } = useContextoMedico(); // Adicione atualizarMedico se existir

    const medicoId = route.params?.id;
    const isEdicao = !!medicoId;

    const { control, handleSubmit, reset, formState: { errors } } = useForm<MedicoFormValues>({
        resolver: zodResolver(medicoFormSchema),
        defaultValues: { nome: '', crm: '', especialidades: '', status: 'ativo' }
    });

    // Se for edição, preenche o form com os dados do médico
    useEffect(() => {
        if (isEdicao && medicoId) {
            const medico = state.items.find(m => m.matricula === medicoId);
            if (medico) {
                reset({
                    nome: medico.nome,
                    crm: medico.crm,
                    especialidades: medico.especialidade?.nome || '',
                    status: medico.status
                });
            }
        }
    }, [isEdicao, medicoId, state.items, reset]);

    const aoSalvar = async (dados: MedicoFormValues) => {
        try {
            if (isEdicao) {
                // Aqui você chamaria a sua função de atualizar
                console.log("Atualizando médico:", medicoId, dados);
            } else {
                // Aqui você chama a função de criar
                await criarMedico(dados as any);
            }
            navigation.goBack(); // Volta para a tela anterior
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={{ padding: tema.espacamento.md }}>
                <Card style={{ gap: tema.espacamento.md }}>
                    <Texto variante="h3" peso="negrito">{isEdicao ? 'Editar Médico' : 'Novo Médico'}</Texto>

                    <Controller control={control} name="nome" render={({ field: { onChange, value } }) => (
                        <CampoFormulario rotulo="Nome Completo" erro={errors.nome?.message}>
                            <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.nome?.message} />
                        </CampoFormulario>
                    )} />

                    <Controller control={control} name="crm" render={({ field: { onChange, value } }) => (
                        <CampoFormulario rotulo="CRM (Ex: 12345-SP)" erro={errors.crm?.message}>
                            <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.crm?.message} />
                        </CampoFormulario>
                    )} />

                    <Controller control={control} name="especialidades" render={({ field: { onChange, value } }) => (
                        <CampoFormulario rotulo="Especialidade" erro={errors.especialidades?.message}>
                            <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.especialidades?.message} />
                        </CampoFormulario>
                    )} />

                    <Botao
                        rotulo="Salvar Médico"
                        onPress={handleSubmit(aoSalvar)}
                    />
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}