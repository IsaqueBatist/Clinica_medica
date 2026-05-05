import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTema } from "../../../hooks/useTema";
import type { Toast } from "../../../contexts/ContextoToast";
import { ToastItem } from "./ToastItem";

/**
 * Viewport — pinada ao topo da tela com SafeArea, empilha os toasts ativos.
 * Não é interativa fora dos cards — `pointerEvents="box-none"` permite que
 * cliques que caiam fora dos toasts atinjam a UI atrás.
 */

interface PropsToastViewport {
  toasts: Toast[];
  aoFechar: (id: string) => void;
}

export function ToastViewport({ toasts, aoFechar }: PropsToastViewport) {
  const { tema } = useTema();

  if (toasts.length === 0) return null;

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <View
        pointerEvents="box-none"
        style={{
          padding: tema.espacamento.lg,
          gap: tema.espacamento.sm,
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} aoFechar={aoFechar} />
        ))}
      </View>
    </SafeAreaView>
  );
}
