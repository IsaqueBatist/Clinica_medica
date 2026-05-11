import { View } from "react-native";
import { Texto, Card, Avatar, Icone } from "../../../../components";
import { useTema } from "../../../../hooks";
import { Cliente } from "../../../../types/models/cliente.type";
import { Medico } from "../../../../types/models/medico.type";


interface Props {
  cliente: Cliente;
  medico: Medico;
}

export function SecaoParticipantes({ cliente, medico }: Props) {
  const { tema } = useTema();

  return (
    <View style={{ gap: tema.espacamento.md }}>
      <Texto variante="h3" peso="negrito">
        Participantes
      </Texto>

      <View style={{ gap: tema.espacamento.sm }}>
        {/* Paciente */}
        <Card preenchimento="md">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.md,
            }}
          >
            <Avatar nome={cliente.nome} tamanho="md" />
            <View style={{ flex: 1, gap: 2 }}>
              <Texto variante="legenda" cor="texto.suave">
                Paciente
              </Texto>
              <Texto variante="corpo" peso="medio">
                {cliente.nome}
              </Texto>
              {cliente.cpf && (
                <Texto variante="legenda" cor="texto.secundario">
                  CPF: {cliente.cpf}
                </Texto>
              )}
              {cliente.telefones?.[0] && (
                <Texto variante="legenda" cor="texto.secundario">
                  {cliente.telefones[0]}
                </Texto>
              )}
            </View>
            {cliente.convenio && (
              <Icone nome="info" tamanho={16} cor="texto.suave" />
            )}
          </View>
        </Card>

        {/* Médico */}
        <Card preenchimento="md">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.md,
            }}
          >
            <Avatar nome={medico.nome} tamanho="md" />
            <View style={{ flex: 1, gap: 2 }}>
              <Texto variante="legenda" cor="texto.suave">
                Médico
              </Texto>
              <Texto variante="corpo" peso="medio">
                {medico.nome}
              </Texto>
              <Texto variante="legenda" cor="texto.secundario">
                CRM: {medico.crm}
              </Texto>
              <Texto variante="legenda" cor="texto.secundario">
                {medico.especialidade.nome}
              </Texto>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
