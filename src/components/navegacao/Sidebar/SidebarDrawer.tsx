import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  View,
} from "react-native";

import { Sidebar, type PropsSidebar, LARGURA_SIDEBAR } from "./Sidebar";

/**
 * SidebarDrawer — apresenta o `Sidebar` como gaveta animada vinda da esquerda.
 *
 * Uso típico:
 *   const [aberto, setAberto] = useState(false);
 *   <BotaoIcone nomeIcone="menu" onPress={() => setAberto(true)} />
 *   <SidebarDrawer aberto={aberto} aoFechar={() => setAberto(false)} {...props} />
 *
 * - Slide horizontal (220ms, easing out) para a entrada.
 * - Backdrop com fade (0 → 0.5 opacidade) clicável para fechar.
 * - Hardware back / `onRequestClose` (Android) também fecham.
 *
 * Espelha os props do `Sidebar` + `aberto` + `aoFechar`. O `aoFechar` é
 * propagado para a Sidebar (renderiza X no cabeçalho) e usado no backdrop.
 */

export interface PropsSidebarDrawer extends Omit<PropsSidebar, "aoFechar"> {
  aberto: boolean;
  aoFechar: () => void;
}

export function SidebarDrawer({
  aberto,
  aoFechar,
  ...propsSidebar
}: PropsSidebarDrawer) {
  // Inicializa fora-da-tela. Cada abertura anima 0 → 1 e cada fechamento 1 → 0.
  const progresso = useRef(new Animated.Value(aberto ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progresso, {
      toValue: aberto ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [aberto, progresso]);

  const translateX = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [-LARGURA_SIDEBAR, 0],
  });
  const opacityBackdrop = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Garantia: depois de fechado totalmente, paramos de renderizar pra não
  // bloquear toques abaixo do Modal. Sem isso, o Modal continuaria intercept-
  // ando taps mesmo invisível.
  if (!aberto) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      onRequestClose={aoFechar}
      animationType="none" // animação manual via Animated
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            opacity: opacityBackdrop,
          }}
        >
          <Pressable
            accessibilityLabel="Fechar menu"
            onPress={aoFechar}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: Math.min(LARGURA_SIDEBAR, Dimensions.get("window").width - 48),
            transform: [{ translateX }],
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 16,
          }}
        >
          <Sidebar {...propsSidebar} aoFechar={aoFechar} />
        </Animated.View>
      </View>
    </Modal>
  );
}
