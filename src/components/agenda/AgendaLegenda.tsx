import { View } from "react-native";
import { Texto } from "../ui/Texto";
import { useTema } from "../../hooks/useTema";
import {
  STATUS_AGENDA,
  STATUS_AGENDA_LABEL,
  StatusAgenda,
} from "../../constants/agenda";
import { STATUS_AGENDA_ROLE } from "../../theme/statusColor";
import type { PaletaCores } from "../../types/paletaCores.type";

function corStatus(status: StatusAgenda, cores: PaletaCores) {
  return cores.status[STATUS_AGENDA_ROLE[status]];
}

export function AgendaLegenda() {
  const { tema } = useTema();
  const itens = Object.values(STATUS_AGENDA);

  return (
    <View
      style={{
        margin: tema.espacamento.lg,
        borderWidth: 1,
        borderColor: tema.cores.borda.padrao,
        borderRadius: tema.raios.md,
        padding: tema.espacamento.md,
        gap: tema.espacamento.xs,
        backgroundColor: tema.cores.fundo.superficie,
      }}
    >
      <Texto variante="legenda" peso="medio" cor="texto.secundario">
        Legenda
      </Texto>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: tema.espacamento.md,
        }}
      >
        {itens.map((s) => (
          <View
            key={s}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.xs,
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: corStatus(s, tema.cores),
              }}
            />
            <Texto variante="legenda" cor="texto.secundario">
              {s} – {STATUS_AGENDA_LABEL[s]}
            </Texto>
          </View>
        ))}
      </View>
    </View>
  );
}
