import React, { useState, useMemo } from "react";
import { View, FlatList, TextInput, RefreshControl } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Importações
import { useTema } from "../../hooks/useTema";
import { Texto, Divisor } from "../../components/ui";
import { ItemListaMedico } from "../../features/medicos/ItemListaMedico";
import { useContextoMedico } from "../../hooks/useContextoMedico";
import { MedicosStackParamList } from "../../navigation/types";
import { Routes } from "../../constants/routes";
import type { Medico } from "../../types/models/medico.type"; // Importe o tipo oficial

export function TelaListarMedico() {
    const { tema } = useTema();
    const { state, criarMedico } = useContextoMedico();

    const [busca, setBusca] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<MedicosStackParamList>>();

    // Filtra por Nome, CRM ou Matrícula
    const medicosFiltrados = useMemo(() => {
        return state.items.filter((medico) => {
            const termoBusca = busca.toLowerCase();
            return (
                medico.nome.toLowerCase().includes(termoBusca) ||
                medico.crm.toLowerCase().includes(termoBusca) ||
                medico.matricula.toLowerCase().includes(termoBusca)
            );
        });
    }, [busca, state.items]);

    const lidarComVerPerfil = (medico: Medico) => {
        // Usando a matricula ou identificacao, dependendo de como a sua rota DetalheMedico espera o ID
        navigation.navigate(Routes.DetalheMedico as any, { id: medico.matricula });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // Seu fetch real virá aqui
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: tema.cores.fundo.primario }}>

            {/* Barra de busca */}
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
                    placeholder="Buscar médico, CRM ou matrícula..."
                    placeholderTextColor={tema.cores.texto.suave}
                    value={busca}
                    onChangeText={setBusca}
                />
            </View>

            <FlatList
                data={medicosFiltrados}
                keyExtractor={(item) => item.matricula} // Usando matricula como Key
                renderItem={({ item }) => (
                    <ItemListaMedico medico={item} aoVerPerfil={lidarComVerPerfil} />
                )}
                ItemSeparatorComponent={() => <Divisor />}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", padding: tema.espacamento.md }}>
                        <Texto variante="corpo" cor="texto.suave">
                            Nenhum médico encontrado.
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
                    paddingBottom: 40,
                    gap: tema.espacamento.md,
                }}
            />
        </View>
    );
}