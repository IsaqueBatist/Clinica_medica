import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, FlatList, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importações do Design System
import { useTema } from "../../hooks/useTema";
import { Texto, Divisor } from "../../components/ui";
import { ItemListaCliente } from "../../features/clientes/ItemListaCliente";
import { useContextoCliente } from "../../hooks/useContextoCliente";
import type { Cliente } from "../../types/models/cliente.type";
import { useFab } from "../../contexts/ContextoFab";
import { useFocusEffect } from "@react-navigation/native";

export function TelaListarClientes() {
  const { tema } = useTema();
  const { state, criarCliente } = useContextoCliente();
  const { show, hide } = useFab();

  useFocusEffect(
    useCallback(() => {
      show();

      return () => {
        hide();
      };
    }, [show, hide])
  );

  const [busca, setBusca] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const clientesFiltrados = useMemo(() => {
    return state.items.filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, state.items]);

  const lidarComVerPerfil = (cliente: Cliente) => {
    console.log("Navegar para o perfil do cliente:", cliente.nome);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await criarCliente({
      nome: "Novo Cliente",
      cpf: "123.456.789-00",
      telefones: ["(11) 99999-9999"],
    });
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}
      edges={["left", "right"]}
    >
      {/* Título da seção e Barra de busca */}
      <View style={{ padding: tema.espacamento.md, gap: tema.espacamento.md }}>
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
          <ItemListaCliente cliente={item} aoVerPerfil={lidarComVerPerfil} />
        )}
        ItemSeparatorComponent={() => <Divisor />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: tema.espacamento.md }}>
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
          gap: tema.espacamento.md,
        }}
      />
    </SafeAreaView>
  );
}
