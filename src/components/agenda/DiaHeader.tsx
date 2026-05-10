import { View } from "react-native";
import { Texto } from "../ui/Texto";
import { useTema } from "../../hooks/useTema";

export function DiaHeader({ titulo }: { titulo: string }) {
  const { tema } = useTema();
  return (
    <View
      style={{
        backgroundColor: tema.cores.fundo.primario,
        paddingHorizontal: tema.espacamento.lg,
        paddingVertical: tema.espacamento.sm,
        borderBottomWidth: 1,
        borderBottomColor: tema.cores.borda.padrao,
        marginBottom: tema.espacamento.sm,
      }}
    >
      <Texto variante="corpo" peso="negrito" cor="texto.primario">
        {titulo}
      </Texto>
    </View>
  );
}
