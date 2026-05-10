import React, { useState, useMemo } from 'react';
import { View, FlatList, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importações do Design System
import { useTema } from '../../hooks/useTema';
import {
  Texto,
  BotaoIcone,
  Divisor,
  MarcaApp
} from '../../components/ui';
import { BarraInferior, SidebarDrawer } from '../../components/navegacao';
import { ItemListaCliente } from '../../features/clientes/ItemListaCliente';
import { useContextoCliente } from '../../hooks/useContextoCliente';
import type { Cliente } from '../../types/models/cliente.type';

export function TelaListarClientes() {
  const { tema, modo, alternar } = useTema();
  const { state, criarCliente } = useContextoCliente();

  const [busca, setBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Estados para navegação e menu lateral
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [chaveSidebar, setChaveSidebar] = useState('cliente.listar');
  const [chaveBarra, setChaveBarra] = useState('home');

  const clientesFiltrados = useMemo(() => {
    return state.items.filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, state.items]);

  const lidarComVerPerfil = (cliente: Cliente) => {
    console.log("Navegar para o perfil do cliente:", cliente.nome);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await criarCliente({
      nome: 'Novo Cliente',
      cpf: '123.456.789-00',
      telefones: ['(11) 99999-9999'],
    });
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={['top', 'left', 'right']}
    >
      {/* Cabeçalho fixo com Hamburger */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
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
          onPress={() => setDrawerAberto(true)}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: tema.espacamento.sm,
          }}
        >
          <MarcaApp tamanho={28} />
          <Texto variante="corpo" peso="negrito">
            Clínica
          </Texto>
        </View>
        <BotaoIcone
          nomeIcone="tema"
          rotuloAcessivel={
            modo === 'claro'
              ? 'Mudar para modo escuro'
              : 'Mudar para modo claro'
          }
          variante="neutro"
          tamanho={20}
          onPress={alternar}
        />
      </View>

      {/* Título da seção e Barra de busca */}
      <View style={{ padding: tema.espacamento.md, gap: tema.espacamento.md }}>
        <Texto variante="h1">Clientes Cadastrados</Texto>

        <TextInput
          style={{
            padding: tema.espacamento.sm,
            borderWidth: 1,
            borderColor: tema.cores.borda.padrao,
            borderRadius: tema.raios.md,
            backgroundColor: tema.cores.fundo.superficie,
            color: tema.cores.texto.primario,
          }}
          placeholder="Buscar cliente..."
          placeholderTextColor={tema.cores.texto.suave}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Lista de Clientes */}
      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.identificacao}
        renderItem={({ item }) => (
          <ItemListaCliente
            cliente={item}
            aoVerPerfil={lidarComVerPerfil}
          />
        )}
        ItemSeparatorComponent={() => <Divisor />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: tema.espacamento.md }}>
            <Texto variante="corpo" cor="texto.suave">
              Nenhum cliente encontrado.
            </Texto>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[tema.cores.marca.primario]}
            tintColor={tema.cores.marca.primario}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: tema.espacamento.md,
          paddingBottom: 120, // Espaço extra para a BarraInferior
          gap: tema.espacamento.md
        }}
      />

      {/* Barra Inferior fixa */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BarraInferior
          chaveAtiva={chaveBarra}
          aoSelecionar={setChaveBarra}
          itens={[
            { chave: 'home', icone: 'casa', rotuloAcessivel: 'Home' },
            { chave: 'busca', icone: 'busca', rotuloAcessivel: 'Buscar' },
            { chave: 'agenda', icone: 'calendario', rotuloAcessivel: 'Agenda' },
            { chave: 'perfil', icone: 'usuario', rotuloAcessivel: 'Perfil' },
          ]}
        />
      </View>

      {/* Drawer overlay */}
      <SidebarDrawer
        aberto={drawerAberto}
        aoFechar={() => setDrawerAberto(false)}
        chaveAtiva={chaveSidebar}
        aoSelecionar={(chave) => {
          setChaveSidebar(chave);
          setDrawerAberto(false);
        }}
        grupos={[
          {
            chave: 'cliente',
            rotulo: 'Cliente',
            icone: 'usuario',
            itens: [
              { chave: 'cliente.cadastrar', rotulo: 'Cadastrar', icone: 'mais' },
              { chave: 'cliente.listar', rotulo: 'Listar', icone: 'menu' },
            ],
          },
          {
            chave: 'medico',
            rotulo: 'Médico',
            icone: 'medico',
            itens: [
              { chave: 'medico.cadastrar', rotulo: 'Cadastrar', icone: 'mais' },
              { chave: 'medico.listar', rotulo: 'Listar', icone: 'menu' },
            ],
          },
        ]}
        cabecalho={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tema.espacamento.sm }}>
            <MarcaApp tamanho={32} />
            <Texto variante="corpo" peso="negrito">Clínica</Texto>
          </View>
        }
      />
    </SafeAreaView>
  );
}
