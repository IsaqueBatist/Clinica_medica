import { View } from "react-native";
import { Icone, Texto, Card } from "../../../../components";
import { FORMA_PAGAMENTO_LABEL } from "../../../../constants/consulta";
import { useTema } from "../../../../hooks";
import { Consulta } from "../../../../types/models/consulta.type";

// Helper para formatar data e hora
function formatarDataHora(data: Date) {
  return {
    data: data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    hora: data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ItemInfoProps {
  icone: string;
  rotulo: string;
  valor: string;
}

function ItemInfo({ icone, rotulo, valor }: ItemInfoProps) {
  const { tema } = useTema();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: tema.espacamento.md,
        paddingVertical: tema.espacamento.sm,
      }}
    >
      <Icone nome={icone as never} tamanho={18} cor="texto.suave" />
      <View style={{ flex: 1 }}>
        <Texto variante="legenda" cor="texto.suave">
          {rotulo}
        </Texto>
        <Texto variante="corpo">{valor}</Texto>
      </View>
    </View>
  );
}

interface Props {
  consulta: Consulta;
}

export function SecaoInformacoes({ consulta }: Props) {
  const { tema } = useTema();
  const { data, hora } = formatarDataHora(consulta.dataHora);

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Informações
      </Texto>

      <Card preenchimento="md">
        <View style={{ gap: 0 }}>
          <ItemInfo icone="calendario" rotulo="Data" valor={data} />
          <ItemInfo icone="agenda" rotulo="Horário" valor={hora} />
          <ItemInfo
            icone="info"
            rotulo="Tipo"
            valor={consulta.tipo === "nova" ? "Nova consulta" : "Retorno"}
          />
          {consulta.formaPagamento && (
            <ItemInfo
              icone="carteira"
              rotulo="Pagamento"
              valor={FORMA_PAGAMENTO_LABEL[consulta.formaPagamento]}
            />
          )}
          {consulta.valor !== undefined && (
            <ItemInfo
              icone="moeda"
              rotulo="Valor"
              valor={formatarMoeda(consulta.valor)}
            />
          )}
        </View>
      </Card>
    </View>
  );
}
