import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Texto } from "../../../components";
import { useTema } from "../../../hooks";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { Routes } from "../../../constants/routes";
import { DrawerParamList } from "../../../navigation";

interface AtalhoConfig {
  label: string;
  descricao: string;
  stack: keyof DrawerParamList;
  tela: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  cor: string;
}

export function AtalhosRapidos() {
  const { tema } = useTema();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const atalhos: AtalhoConfig[] = useMemo(
    () => [
      {
        label: "Marcar",
        descricao: "Nova consulta",
        stack: Routes.ConsultasStack as keyof DrawerParamList,
        tela: Routes.ConsultaMarcacao,
        icon: "plus-circle",
        cor: tema.cores.marca.primario,
      },
      {
        label: "Confirmar",
        descricao: "Pacientes do dia",
        stack: Routes.ConsultasStack as keyof DrawerParamList,
        tela: Routes.ConsultaConfirmacao,
        icon: "check-circle",
        cor: tema.cores.status.aviso,
      },
      {
        label: "Realizar",
        descricao: "Iniciar atendimento",
        stack: Routes.ConsultasStack as keyof DrawerParamList,
        tela: Routes.ConsultaRealizacao,
        icon: "activity",
        cor: tema.cores.marca.secundario,
      },
      {
        label: "Encerrar",
        descricao: "Registrar pagamento",
        stack: Routes.ConsultasStack as keyof DrawerParamList,
        tela: Routes.ConsultaEncerramento,
        icon: "dollar-sign",
        cor: tema.cores.status.sucesso,
      },
    ],
    [tema],
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: tema.espacamento.sm,
      }}
    >
      {atalhos.map((a) => (
        <TouchableOpacity
          key={a.label}
          onPress={() =>
            (navigation.navigate as any)(a.stack, { screen: a.tela })
          }
          activeOpacity={0.75}
          style={{
            width: "48%",
            backgroundColor: tema.cores.fundo.superficie,
            borderRadius: tema.raios.lg,
            borderWidth: 1,
            borderColor: tema.cores.borda.padrao,
            // Borda esquerda colorida — identidade visual de cada ação
            borderLeftWidth: 3,
            borderLeftColor: a.cor,
            padding: tema.espacamento.md,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Ícone com fundo semitransparente */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: a.cor + "18",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Feather name={a.icon} size={18} color={a.cor} />
          </View>

          {/* Textos empilhados */}
          <View style={{ flex: 1, gap: 1 }}>
            <Texto
              variante="corpo"
              peso="negrito"
              style={{ color: tema.cores.texto.primario, fontSize: 14 }}
            >
              {a.label}
            </Texto>
            <Texto
              variante="legenda"
              style={{ color: tema.cores.texto.suave, fontSize: 11 }}
            >
              {a.descricao}
            </Texto>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}