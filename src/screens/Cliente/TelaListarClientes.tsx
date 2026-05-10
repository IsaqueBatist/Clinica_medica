import React, { useState, useMemo } from "react";
import { View, FlatList, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importações do Design System
import { useTema } from "../../hooks/useTema";
import { Texto, BotaoIcone, Divisor, MarcaApp } from "../../components/ui";
import { BarraInferior, SidebarDrawer } from "../../components/navegacao";
import { ItemListaCliente } from "../../features/clientes/ItemListaCliente";
import { useContextoCliente } from "../../hooks/useContextoCliente";
import type { Cliente } from "../../types/models/cliente.type";
import { ClientesStackParamList } from "../../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

export function TelaListarClientes() {
  const { tema } = useTema();
  const { state, criarCliente } = useContextoCliente();

  const [busca, setBusca] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<ClientesStackParamList>>();

  const clientesFiltrados = useMemo(() => {
    return state.items.filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, state.items]);

  const lidarComVerPerfil = (cliente: Cliente) => {
    navigation.navigate("DetalheCliente", { id: cliente.identificacao });
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
          paddingBottom: 120,
          gap: tema.espacamento.md,
        }}
      />
    </SafeAreaView>
  );
}
