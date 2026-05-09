import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export interface PropsFormScreen {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Útil quando há header/stack acima do formulário. */
  keyboardVerticalOffset?: number;
}

/**
 * Layout padrão para telas com formulário: evita o teclado cobrir inputs e
 * mantém toques em botões/links dentro do ScrollView funcionando.
 */
export function FormScreen({
  children,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
}: PropsFormScreen) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
