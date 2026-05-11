import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTema } from '../../hooks/useTema';
import { Texto, Card, Botao, Icone } from '../../components/ui';
import { useContextoMedico } from '../../hooks/useContextoMedico';
import { MedicosStackParamList } from '../../navigation/types';
import { Routes } from '../../constants/routes';

export function TelaDetalheMedico() {
    const { tema } = useTema();
    const route = useRoute<RouteProp<MedicosStackParamList, typeof Routes.DetalheMedico>>();
    const navigation = useNavigation<NativeStackNavigationProp<MedicosStackParamList>>();
    const { state } = useContextoMedico();

    const medicoId = route.params.id;
    // Busca o médico pelo ID (matricula)
    const medico = state.items.find(m => m.matricula === medicoId);

    if (!medico) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Texto>Médico não encontrado.</Texto>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}>
            <View style={{ padding: tema.espacamento.md, gap: tema.espacamento.md }}>

                <Card style={{ gap: tema.espacamento.sm }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm }}>
                        <Icone nome={"usuario" as any} tamanho={24} cor="marca.primario" />
                        <Texto variante="h2" peso="negrito">{medico.nome}</Texto>
                    </View>

                    <View style={{ marginTop: tema.espacamento.sm }}>
                        <Texto variante="legenda" cor="texto.secundario">CRM</Texto>
                        <Texto variante="corpo" peso="medio">{medico.crm}</Texto>
                    </View>

                    <View style={{ marginTop: tema.espacamento.sm }}>
                        <Texto variante="legenda" cor="texto.secundario">Especialidade</Texto>
                        <Texto variante="corpo" peso="medio">{medico.especialidade?.nome || "Não informada"}</Texto>
                    </View>

                    <View style={{ marginTop: tema.espacamento.sm }}>
                        <Texto variante="legenda" cor="texto.secundario">Status</Texto>
                        <Texto variante="corpo" peso="medio" cor={medico.status === 'ativo' ? 'status.sucesso' : 'texto.secundario'}>
                            {medico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Texto>
                    </View>
                </Card>

                <Botao
                    rotulo="Editar Médico"
                    iconeEsquerda={"editar" as any}
                    onPress={() => navigation.navigate(Routes.CadastroMedico, { id: medicoId })}
                />
            </View>
        </ScrollView>
    );
}