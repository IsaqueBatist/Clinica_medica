import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

import { useTema } from "../../../hooks/useTema";
import type { PaletaCores } from "../../../types/paletaCores.type";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { Texto } from "../../ui/Texto";
import type { Toast, VarianteToast } from "../../../contexts/ContextoToast";

interface PropsToastItem {
  toast: Toast;
  aoFechar: (id: string) => void;
}

const ICONE_POR_VARIANTE: Record<VarianteToast, NomeIcone> = {
  sucesso: "check",
  erro: "fechar",
  aviso: "aviso",
  info: "info",
};

function corStatusPara(
  variante: VarianteToast,
  cores: PaletaCores,
): string {
  return cores.status[variante];
}

export function ToastItem({ toast, aoFechar }: PropsToastItem) {
  const { tema } = useTema();
  const opacidade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacidade, translateY]);

  const corBarra = corStatusPara(toast.variante, tema.cores);

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={{
        opacity: opacidade,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: tema.cores.fundo.superficie,
          borderRadius: tema.raios.lg,
          borderWidth: 1,
          borderColor: tema.cores.borda.padrao,
          // sombra leve
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 4,
          overflow: "hidden",
        }}
      >
        {/* Barra colorida lateral */}
        <View style={{ width: 4, backgroundColor: corBarra }} />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: tema.espacamento.md,
            padding: tema.espacamento.md,
          }}
        >
          <View style={{ marginTop: 2 }}>
            <Icone
              nome={ICONE_POR_VARIANTE[toast.variante]}
              tamanho={20}
              cor={corBarra}
            />
          </View>

          <View style={{ flex: 1, gap: tema.espacamento.xs }}>
            <Texto variante="corpo" peso="medio">
              {toast.titulo}
            </Texto>
            {toast.descricao && (
              <Texto variante="legenda" cor="texto.secundario">
                {toast.descricao}
              </Texto>
            )}
          </View>

          {toast.acao ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={toast.acao.rotulo}
              hitSlop={8}
              onPress={() => {
                toast.acao?.aoPressionar();
                aoFechar(toast.id);
              }}
              style={{
                paddingHorizontal: tema.espacamento.sm,
                justifyContent: "center",
              }}
            >
              <Texto variante="legenda" peso="negrito" style={{ color: corBarra }}>
                {toast.acao.rotulo}
              </Texto>
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar notificação"
            hitSlop={8}
            onPress={() => aoFechar(toast.id)}
          >
            <Icone nome="fechar" tamanho={16} cor="texto.suave" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
