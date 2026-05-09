import { FlatList, Pressable, View } from "react-native";
import { useContextoMedico } from "../../../../hooks";
import { Texto } from "../../../../components/ui/Texto";
import { useTema } from "../../../../hooks/useTema";
import { STATUS_ENTIDADE } from "../../../../constants/pessoa";
import { WizardAction, WizardState } from "../../marcacaoTypes";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function StepMedico({ state, dispatch }: Props) {
  const { tema } = useTema();
  const { state: medicosState } = useContextoMedico();

  const ativos = medicosState.items.filter(
    (m) => m.status === STATUS_ENTIDADE.ATIVO,
  );

  return (
    <View style={{ flex: 1, padding: tema.espacamento.lg }}>
      <Texto variante="h3" peso="negrito">
        Selecione o médico
      </Texto>
      <FlatList
        data={ativos}
        keyExtractor={(m) => m.matricula}
        renderItem={({ item }) => {
          const selecionado = state.medico?.matricula === item.matricula;
          return (
            <Pressable
              onPress={() => dispatch({ type: "SET_MEDICO", payload: item })}
              style={{
                padding: tema.espacamento.md,
                backgroundColor: selecionado
                  ? tema.cores.fundo.suave
                  : tema.cores.fundo.superficie,
                borderRadius: tema.raios.md,
                marginVertical: tema.espacamento.xs,
                borderWidth: 1,
                borderColor: selecionado
                  ? tema.cores.marca.secundario
                  : tema.cores.borda.padrao,
              }}
            >
              <Texto>{item.nome}</Texto>
              <Texto variante="legenda" cor="texto.secundario">
                {item.especialidade.nome} · {item.crm}
              </Texto>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
