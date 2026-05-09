import { FlatList, Pressable, View } from "react-native";

import { useContextoCliente } from "../../../../hooks";
import { Texto } from "../../../../components/ui/Texto";
import { useTema } from "../../../../hooks/useTema";
import { STATUS_ENTIDADE } from "../../../../constants/pessoa";
import { AcaoMarcacao, EstadoMarcacao } from "../../tiposMarcacao";

interface Props {
  state: EstadoMarcacao;
  dispatch: React.Dispatch<AcaoMarcacao>;
}

export function EtapaCliente({ state, dispatch }: Props) {
  const { tema } = useTema();
  const { state: clientesState } = useContextoCliente();

  const ativos = clientesState.items.filter(
    (c) => c.status === STATUS_ENTIDADE.ATIVO,
  );

  return (
    <View style={{ flex: 1, padding: tema.espacamento.lg }}>
      <Texto variante="h3" peso="negrito">
        Selecione o cliente
      </Texto>
      <FlatList
        data={ativos}
        keyExtractor={(c) => c.identificacao}
        renderItem={({ item }) => {
          const selecionado =
            state.cliente?.identificacao === item.identificacao;
          return (
            <Pressable
              onPress={() => dispatch({ type: "SET_CLIENTE", payload: item })}
              style={{
                padding: tema.espacamento.md,
                backgroundColor: selecionado
                  ? tema.cores.fundo.suave
                  : tema.cores.fundo.superficie,
                borderRadius: tema.raios.md,
                marginVertical: tema.espacamento.xs,
              }}
            >
              <Texto>{item.nome}</Texto>
              <Texto variante="legenda" cor="texto.secundario">
                {item.cpf}
              </Texto>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
