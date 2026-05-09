import React, { useState, useMemo } from 'react';
import { View, FlatList, TextInput, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importações do Design System do seu grupo
import { useTema } from '../../hooks/useTema';
import { Texto, BotaoIcone, Divisor } from '../../components/ui';
import { ItemListaCliente } from '../../features/clientes/ItemListaCliente';
import { useContextoCliente } from '../../hooks/useContextoCliente';
import type { Cliente } from '../../types/models/cliente.type';

export function TelaListarClientes() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const { state, criarCliente } = useContextoCliente();

  const [busca, setBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const clientesFiltrados = useMemo(() => {
    return state.items.filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, state.items]);

  const lidarComVerPerfil = (cliente: Cliente) => {
    console.log("Navegar para o perfil do cliente:", cliente.nome);
    // Aqui no futuro entrará a navegação: navigation.navigate('PerfilCliente', { id: cliente.id })
  };

  const lidarComEditar = (cliente: Cliente) => {
    console.log("Abrir modal de edição do cliente:", cliente.nome);
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
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Cabeçalho da Lista (Igual ao Figma) */}
        <View 
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: tema.espacamento.md 
          }}
        >
          <Texto variante="h1">Clientes Cadastrados</Texto> 
          <BotaoIcone 
            nomeIcone="chevronBaixo" 
            rotuloAcessivel="Abrir filtros" 
            onPress={() => console.log("Abrir filtros")}
          />
        </View>

        {/* Barra de busca */}
        <TextInput
          style={{
            marginHorizontal: tema.espacamento.md,
            marginBottom: tema.espacamento.md,
            padding: tema.espacamento.sm,
            borderWidth: 1,
            borderColor: tema.cores.borda.padrao,
            borderRadius: tema.raios.md,
            backgroundColor: tema.cores.fundo.secundario,
          }}
          placeholder="Buscar cliente..."
          value={busca}
          onChangeText={setBusca}
        />

        {/* A Lista de fato */}
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.identificacao}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ItemListaCliente 
              cliente={item} 
              aoVerPerfil={lidarComVerPerfil}
              aoEditar={lidarComEditar}
            />
          )}
          ItemSeparatorComponent={() => <Divisor />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: tema.espacamento.md }}>
              <Texto variante="corpo" style={{ color: tema.cores.texto.suave }}>
                Nenhum cliente encontrado.
              </Texto>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: tema.espacamento.md,
            paddingBottom: tema.espacamento.xl,
            gap: tema.espacamento.md
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}


