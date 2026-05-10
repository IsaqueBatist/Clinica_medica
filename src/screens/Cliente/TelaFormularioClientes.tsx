import React, { useEffect, useContext, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { clienteFormSchema, ClienteFormValues } from './ClienteFormSchema';

// Hooks de Contexto e Tema
import { useTema } from '../../hooks/useTema';
import { useToast } from '../../hooks/useToast';
import { ContextoCliente } from '../../contexts/ContextoCliente';

// Componentes UI do Design System
import {
    Texto,
    Botao,
    EntradaTexto,
    Card,
    Avatar,
    Icone,
    CampoFormulario,
    BotaoIcone,
    MarcaApp
} from '../../components/ui';

// Componentes de Navegação
import { BarraInferior, SidebarDrawer } from '../../components/navegacao';

// ------------------------------------------------------------------
// Funções de Máscara Simples (Sem dependências externas)
// ------------------------------------------------------------------
const mascaraData = (valor: string) => {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 10);
};

const mascaraTelefone = (valor: string) => {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})/, '$1-$2')
        .substring(0, 15);
};

// Interface para teste direto no App.tsx
interface PropsTelaFormulario {
    clienteId?: string;
}

export function TelaFormularioClientes({ clienteId }: PropsTelaFormulario) {
    const { tema, modo, alternar } = useTema();
    const toast = useToast();
    const clienteCtx = useContext(ContextoCliente);

    const [drawerAberto, setDrawerAberto] = useState(false);
    const [chaveBarra, setChaveBarra] = useState('home');

    const isEdicao = !!clienteId;
    const [chaveSidebar, setChaveSidebar] = useState(isEdicao ? 'cliente.listar' : 'cliente.cadastrar');

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClienteFormValues>({
        resolver: zodResolver(clienteFormSchema),
        defaultValues: {
            nome: '', dataNascimento: '', email: '', telefone: '',
            endereco: { logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' },
            convenio: { nome: '', matricula: '' }
        }
    });

    useEffect(() => {
        if (isEdicao && clienteCtx && clienteId) {
            const clienteExistente = clienteCtx.state.items.find(c => c.identificacao === clienteId);
            if (clienteExistente) {
                // Aqui você vai mapear os dados da API para o Form. 
                // Coloquei um exemplo base, ajuste com os nomes reais que vem do seu backend:
                reset({
                    nome: clienteExistente.nome,
                    // email: clienteExistente.email,
                    // telefone: clienteExistente.telefones?.[0] || '',
                    // ... mapeie o resto conforme a sua API
                });
            }
        }
    }, [isEdicao, clienteId, clienteCtx, reset]);

    const onSubmit = async (data: ClienteFormValues) => {
        if (!clienteCtx) return;
        try {
            if (isEdicao && clienteId) {
                await clienteCtx.atualizarCliente(clienteId, data as any);
                toast.exibir({ variante: "sucesso", titulo: "Cliente atualizado com sucesso!" });
            } else {
                await clienteCtx.criarCliente(data as any);
                toast.exibir({ variante: "sucesso", titulo: "Cliente cadastrado com sucesso!" });
            }
            console.log("Simulando: Voltando para a tela anterior (goBack)");
        } catch (error) {
            toast.exibir({ variante: "erro", titulo: "Erro ao salvar os dados." });
        }
    };

    const lidarComDesativar = () => {
        Alert.alert('Desativar', 'Tem certeza que deseja desativar este cliente?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Desativar', style: 'destructive',
                onPress: async () => {
                    if (clienteCtx && clienteId) {
                        try {
                            await clienteCtx.desativarCliente(clienteId);
                            toast.exibir({ variante: "sucesso", titulo: "Cliente desativado!" });
                            console.log("Simulando: Voltando para a tela anterior (goBack)");
                        } catch (e) {
                            toast.exibir({ variante: "erro", titulo: "Erro ao desativar." });
                        }
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }} edges={['top', 'left', 'right']}>
            {/* CABEÇALHO */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm,
                paddingHorizontal: tema.espacamento.md, paddingVertical: tema.espacamento.sm,
                backgroundColor: tema.cores.fundo.superficie, borderBottomWidth: 1, borderBottomColor: tema.cores.borda.padrao,
            }}>
                <BotaoIcone nomeIcone={"menu" as any} rotuloAcessivel="Abrir menu" variante="neutro" tamanho={20} onPress={() => setDrawerAberto(true)} />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm }}>
                    <MarcaApp tamanho={28} />
                    <Texto variante="corpo" peso="negrito">Clínica</Texto>
                </View>
                <BotaoIcone nomeIcone={"tema" as any} rotuloAcessivel={modo === 'claro' ? 'Escuro' : 'Claro'} variante="neutro" tamanho={20} onPress={alternar} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{ padding: tema.espacamento.md, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
                    <View style={{ marginBottom: tema.espacamento.md }}>
                        <Texto variante="h1">{isEdicao ? 'Detalhes do Cliente' : 'Cadastrar Novo Cliente'}</Texto>
                    </View>

                    <Card style={{ padding: tema.espacamento.md, gap: tema.espacamento.md }}>

                        {/* ============================== */}
                        {/* SEÇÃO: DADOS PESSOAIS          */}
                        {/* ============================== */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Texto variante="h3" peso="medio">Dados Pessoais</Texto>
                            <Icone nome={"usuario" as any} tamanho={24} />
                        </View>

                        {isEdicao && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm }}>
                                <Texto cor="texto.secundario">{clienteId}</Texto>
                                <Avatar nome="" />
                            </View>
                        )}

                        <Controller control={control} name="nome" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Nome" erro={errors.nome?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.nome?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="dataNascimento" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Data de Nascimento" erro={errors.dataNascimento?.message}>
                                <EntradaTexto tipo="numero" placeholder="DD/MM/AAAA" value={value} onChangeText={(t) => onChange(mascaraData(t))} erro={!!errors.dataNascimento?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="E-mail" erro={errors.email?.message}>
                                <EntradaTexto tipo="email" value={value} onChangeText={onChange} erro={!!errors.email?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="telefone" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Telefone" erro={errors.telefone?.message}>
                                <EntradaTexto tipo="telefone" placeholder="(11) 99999-9999" value={value} onChangeText={(t) => onChange(mascaraTelefone(t))} erro={!!errors.telefone?.message} />
                            </CampoFormulario>
                        )} />


                        {/* ============================== */}
                        {/* SEÇÃO: ENDEREÇO                */}
                        {/* ============================== */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tema.espacamento.md }}>
                            <Texto variante="h3" peso="medio">Endereço</Texto>
                            <Icone nome={"mapa" as any} tamanho={24} />
                        </View>

                        <Controller control={control} name="endereco.logradouro" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Logradouro" erro={errors.endereco?.logradouro?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.endereco?.logradouro?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="endereco.numero" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Número" erro={errors.endereco?.numero?.message}>
                                <EntradaTexto tipo="numero" value={value} onChangeText={onChange} erro={!!errors.endereco?.numero?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="endereco.complemento" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Complemento" erro={errors.endereco?.complemento?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.endereco?.complemento?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="endereco.bairro" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Bairro" erro={errors.endereco?.bairro?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.endereco?.bairro?.message} />
                            </CampoFormulario>
                        )} />

                        {/* Cidade e UF Lado a Lado */}
                        <View style={{ flexDirection: 'row', gap: tema.espacamento.sm }}>
                            <View style={{ flex: 3 }}>
                                <Controller control={control} name="endereco.cidade" render={({ field: { onChange, value } }) => (
                                    <CampoFormulario rotulo="Cidade" erro={errors.endereco?.cidade?.message}>
                                        <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.endereco?.cidade?.message} />
                                    </CampoFormulario>
                                )} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Controller control={control} name="endereco.estado" render={({ field: { onChange, value } }) => (
                                    <CampoFormulario rotulo="UF" erro={errors.endereco?.estado?.message}>
                                        <EntradaTexto value={value} autoCapitalize="characters" maxLength={2} onChangeText={onChange} erro={!!errors.endereco?.estado?.message} />
                                    </CampoFormulario>
                                )} />
                            </View>
                        </View>


                        {/* ============================== */}
                        {/* SEÇÃO: CONVÊNIO                */}
                        {/* ============================== */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: tema.espacamento.md }}>
                            <Texto variante="h3" peso="medio">Convênio</Texto>
                            <Icone nome={"predio" as any} tamanho={24} />
                        </View>

                        <Controller control={control} name="convenio.nome" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Nome do Convênio" erro={errors.convenio?.nome?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.convenio?.nome?.message} />
                            </CampoFormulario>
                        )} />

                        <Controller control={control} name="convenio.matricula" render={({ field: { onChange, value } }) => (
                            <CampoFormulario rotulo="Matrícula do Conveniado" erro={errors.convenio?.matricula?.message}>
                                <EntradaTexto value={value} onChangeText={onChange} erro={!!errors.convenio?.matricula?.message} />
                            </CampoFormulario>
                        )} />

                        {/* ============================== */}
                        {/* OPÇÕES (BOTÕES)                */}
                        {/* ============================== */}
                        <Texto variante="h3" peso="medio" style={{ marginTop: tema.espacamento.md }}>Opções</Texto>


                        <View style={{ gap: tema.espacamento.sm }}>
                            <Botao rotulo="Editar" iconeDireita={"editar" as any} onPress={handleSubmit(onSubmit)} carregando={isSubmitting} />
                            <Botao rotulo="Desativar" onPress={lidarComDesativar} />
                            <Botao rotulo="Deletar" onPress={() => Alert.alert('Aviso', 'Use a opção Desativar.', [{ text: 'OK' }])} />
                            <Botao rotulo="Cadastrar Cliente" iconeDireita={"check" as any} onPress={handleSubmit(onSubmit)} carregando={isSubmitting} />
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* BARRAS DE NAVEGAÇÃO */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <BarraInferior chaveAtiva={chaveBarra} aoSelecionar={(chave) => setChaveBarra(chave)} itens={[
                    { chave: 'home', icone: 'casa', rotuloAcessivel: 'Home' },
                    { chave: 'busca', icone: 'busca', rotuloAcessivel: 'Buscar' },
                    { chave: 'agenda', icone: 'calendario', rotuloAcessivel: 'Agenda' },
                    { chave: 'perfil', icone: 'usuario', rotuloAcessivel: 'Perfil' },
                ]} />
            </View>

            <SidebarDrawer aberto={drawerAberto} aoFechar={() => setDrawerAberto(false)} chaveAtiva={chaveSidebar} aoSelecionar={(chave) => { setChaveSidebar(chave); setDrawerAberto(false); }} grupos={[
                { chave: 'cliente', rotulo: 'Cliente', icone: 'usuario', itens: [{ chave: 'cliente.cadastrar', rotulo: 'Cadastrar', icone: 'mais' }, { chave: 'cliente.listar', rotulo: 'Listar', icone: 'menu' }] },
                { chave: 'medico', rotulo: 'Médico', icone: 'medico', itens: [{ chave: 'medico.cadastrar', rotulo: 'Cadastrar', icone: 'mais' }, { chave: 'medico.listar', rotulo: 'Listar', icone: 'menu' }] },
            ]} cabecalho={<View style={{ flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm }}><MarcaApp tamanho={32} /><Texto variante="corpo" peso="negrito">Clínica</Texto></View>} />
        </SafeAreaView>
    );
}