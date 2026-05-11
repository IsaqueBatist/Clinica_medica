import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EstadoErro } from "../../../components";
import { Routes } from "../../../constants/routes";
import { consultasMock } from "../../../mocks";
import { TelaDetalheConsultaConteudo } from "./detalhe/TelaDetalheConsultaConteudo";
import { ConsultasStackParamList } from "../../../navigation/types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";

type RotaDetalhe = RouteProp<
  ConsultasStackParamList,
  typeof Routes.DetalheConsulta
>;

export function TelaDetalheConsulta() {
  const route = useRoute<RotaDetalhe>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ConsultasStackParamList>>();
  const { id } = route.params;

  const consulta = consultasMock.find((c) => c.numero === id);

  if (!consulta) {
    return (
      <EstadoErro
        titulo="Consulta não encontrada"
        descricao="Não foi possível carregar os dados desta consulta."
        rotuloAcao="Voltar"
        aoExecutarAcao={() => navigation.goBack()}
      />
    );
  }

  return (
    <TelaDetalheConsultaConteudo
      consulta={consulta}
      aoEditar={() => {
        /* navigation.navigate(...) */
      }}
      aoCancelar={() => navigation.navigate(Routes.ConsultaCancelamento)}
      aoVoltar={() => navigation.goBack()}
    />
  );
}
