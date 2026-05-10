import { Pressable, View } from "react-native";
import { Texto } from "../ui/Texto";
import { useTema } from "../../hooks/useTema";
import { STATUS_AGENDA, StatusAgenda } from "../../constants/agenda";
import { STATUS_AGENDA_ROLE } from "../../theme/statusColor";
import type { PaletaCores } from "../../types/paletaCores.type";
import { Slot } from "../../types/models/agenda";

interface Props {
  slot: Slot;
  selecionado: boolean;
  onPress?: (slot: Slot) => void;
}

const SELECIONAVEIS: readonly StatusAgenda[] = [
  STATUS_AGENDA.LIVRE,
  STATUS_AGENDA.CANCELADO_PELO_CLIENTE,
];

function corStatus(status: StatusAgenda, cores: PaletaCores) {
  return cores.status[STATUS_AGENDA_ROLE[status]];
}

export function SlotItem({ slot, selecionado, onPress }: Props) {
  const { tema } = useTema();
  const selecionavel = SELECIONAVEIS.includes(slot.status);
  const cor = corStatus(slot.status, tema.cores);

  return (
    <Pressable
      disabled={!selecionavel}
      onPress={() => onPress?.(slot)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: tema.espacamento.md,
        paddingVertical: tema.espacamento.xs,
        paddingHorizontal: tema.espacamento.lg,
      }}
    >
      <View style={{ width: 56 }}>
        <Texto variante="legenda" peso="medio" cor="texto.secundario">
          {slot.horario}
        </Texto>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: cor,
          borderRadius: tema.raios.md,
          paddingVertical: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          borderWidth: selecionado ? 2 : 0,
          borderColor: tema.cores.borda.foco,
          opacity: selecionavel ? 1 : 0.55,
          alignItems: "center",
        }}
      >
        <Texto variante="legenda" peso="negrito" style={{ color: "#fff" }}>
          {slot.status}
        </Texto>
      </View>
    </Pressable>
  );
}
