import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import { clientesMock } from "../../mocks/clientes";
import { medicosMock } from "../../mocks/medicos";
import { consultasMock } from "../../mocks/consultas";

import {
  Avatar,
  Badge,
  Botao,
  BotaoIcone,
  CampoFormulario,
  Card,
  Divisor,
  EntradaData,
  EntradaSelect,
  EntradaTexto,
  Icone,
  MarcaApp,
  Texto,
} from "../../components/ui";
import { BarraInferior, SidebarDrawer } from "../../components/navegacao";
import {
  EstadoCarregando,
  EstadoErro,
  EstadoSucesso,
} from "../../components/feedback";
import { ItemListaCliente } from "../../features/clientes";
import { ItemListaMedico } from "../../features/medicos";
import {
  CalendarioDia,
  type ConsultaCalendario,
} from "../../features/consultas";

/**
 * TelaShowcase — "stories" interna, layout single-column friendly a mobile.
 *
 * Header fixo com hamburger (esquerda) + título + theme toggle (direita).
 * Sidebar é drawer (SidebarDrawer) — não ocupa espaço fixo na tela; abre via
 * hamburger e fecha via X / backdrop.
 *
 * BarraInferior fica absoluta no rodapé. ScrollView do conteúdo recebe
 * paddingBottom suficiente pra o último card não ficar atrás dela.
 */

export interface PropsTelaShowcase {
  aoSair?: () => void;
}

function paraConsultaCalendario(): ConsultaCalendario[] {
  return consultasMock.map((c) => ({
    id: c.numero,
    dataHora: new Date(c.dataHora),
    duracaoMinutos: 30,
    nomePaciente: c.cliente.nome,
    nomeMedico: c.medico.nome,
    status: c.situacao,
  }));
}

export function TelaShowcase({ aoSair }: PropsTelaShowcase) {
  const insets = useSafeAreaInsets();
  const { tema, modo, alternar } = useTema();
  const toast = useToast();

  const [drawerAberto, setDrawerAberto] = useState(false);
  const [chaveSidebar, setChaveSidebar] = useState("cliente.listar");
  const [chaveBarra, setChaveBarra] = useState("home");

  const [textoLivre, setTextoLivre] = useState("");
  const [convenio, setConvenio] = useState<string | undefined>();
  const [data, setData] = useState("");

  const [estadoFluxo, setEstadoFluxo] = useState<
    "ocioso" | "carregando" | "sucesso" | "erro"
  >("ocioso");

  // Dia do calendário: hoje, com algumas consultas distribuídas em horários
  // diferentes para a demonstração ficar didática.
  const dataCalendario = new Date();
  const consultasHoje: ConsultaCalendario[] = paraConsultaCalendario()
    .slice(0, 4)
    .map((c, i) => {
      const d = new Date(dataCalendario);
      // Espalha pelos horários 08:00, 09:30, 11:00, 14:00
      const slots = [
        { h: 8, m: 0 },
        { h: 9, m: 30 },
        { h: 11, m: 0 },
        { h: 14, m: 0 },
      ];
      const slot = slots[i] ?? { h: 8 + i, m: 0 };
      d.setHours(slot.h, slot.m, 0, 0);
      return { ...c, dataHora: d };
    });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* Header fixo */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tema.espacamento.sm,
          paddingHorizontal: tema.espacamento.md,
          paddingVertical: tema.espacamento.sm,
          backgroundColor: tema.cores.fundo.superficie,
          borderBottomWidth: 1,
          borderBottomColor: tema.cores.borda.padrao,
        }}
      >
        <BotaoIcone
          nomeIcone="menu"
          rotuloAcessivel="Abrir menu"
          variante="neutro"
          tamanho={20}
          onPress={() => setDrawerAberto(true)}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: tema.espacamento.sm,
          }}
        >
          <MarcaApp tamanho={28} />
          <Texto variante="corpo" peso="negrito">
            Clínica
          </Texto>
        </View>
        <BotaoIcone
          nomeIcone="tema"
          rotuloAcessivel={
            modo === "claro"
              ? "Mudar para modo escuro"
              : "Mudar para modo claro"
          }
          variante="neutro"
          tamanho={20}
          onPress={alternar}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: tema.espacamento.lg,
          paddingBottom: 120 + insets.bottom,
          gap: tema.espacamento.xl,
        }}
      >
        <View>
          <Texto variante="h1" peso="negrito">
            Design System
          </Texto>
          <Texto variante="corpo" cor="texto.secundario">
            Componentes em uso. Abra o menu lateral ou troque o tema acima.
          </Texto>
        </View>

        <Secao titulo="Tipografia" descricao="Variantes de fonte do tema.">
          <Texto variante="h1" peso="negrito">
            H1 · Título de tela
          </Texto>
          <Texto variante="h2" peso="negrito">
            H2 · Seção
          </Texto>
          <Texto variante="h3" peso="negrito">
            H3 · Subseção
          </Texto>
          <Texto variante="corpo">Corpo · Texto padrão de leitura.</Texto>
          <Texto variante="legenda" cor="texto.suave">
            Legenda · helper, timestamp.
          </Texto>
        </Secao>

        <Secao titulo="Cores" descricao="Tokens de cor da paleta.">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.sm,
            }}
          >
            {[
              { cor: tema.cores.marca.primario, nome: "marca.primario" },
              { cor: tema.cores.marca.secundario, nome: "marca.secundario" },
              { cor: tema.cores.fundo.primario, nome: "fundo.primario" },
              { cor: tema.cores.fundo.superficie, nome: "fundo.superficie" },
              { cor: tema.cores.status.sucesso, nome: "status.sucesso" },
              { cor: tema.cores.status.erro, nome: "status.erro" },
              { cor: tema.cores.status.aviso, nome: "status.aviso" },
              { cor: tema.cores.status.info, nome: "status.info" },
            ].map((swatch) => (
              <View
                key={swatch.nome}
                style={{
                  width: 140,
                  borderRadius: tema.raios.md,
                  borderWidth: 1,
                  borderColor: tema.cores.borda.padrao,
                  overflow: "hidden",
                  backgroundColor: tema.cores.fundo.superficie,
                }}
              >
                <View style={{ height: 56, backgroundColor: swatch.cor }} />
                <View style={{ padding: tema.espacamento.sm }}>
                  <Texto variante="legenda" peso="medio">
                    {swatch.nome}
                  </Texto>
                </View>
              </View>
            ))}
          </View>
        </Secao>

        <Secao titulo="Botões" descricao="Variantes × estados.">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.sm,
            }}
          >
            <Botao rotulo="Primário" variante="primario" />
            <Botao rotulo="Secundário" variante="secundario" />
            <Botao rotulo="Fantasma" variante="fantasma" />
            <Botao rotulo="Perigo" variante="perigo" />
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.sm,
            }}
          >
            <Botao rotulo="Carregando" variante="primario" carregando />
            <Botao rotulo="Desabilitado" variante="primario" disabled />
            <Botao
              rotulo="Com ícone"
              variante="secundario"
              iconeEsquerda="mais"
            />
            <Botao rotulo="Pequeno" tamanho="sm" />
            <Botao rotulo="Grande" tamanho="lg" />
          </View>
          <View style={{ flexDirection: "row", gap: tema.espacamento.sm }}>
            <BotaoIcone
              nomeIcone="mais"
              rotuloAcessivel="Adicionar"
              variante="marca"
            />
            <BotaoIcone
              nomeIcone="editar"
              rotuloAcessivel="Editar"
              variante="neutro"
            />
            <BotaoIcone
              nomeIcone="fechar"
              rotuloAcessivel="Excluir"
              variante="perigo"
            />
            <BotaoIcone
              nomeIcone="mais"
              rotuloAcessivel="FAB"
              variante="flutuante"
              tamanho={24}
            />
          </View>
        </Secao>

        <Secao titulo="Formulários" descricao="Inputs em todos os estados.">
          <CampoFormulario
            rotulo="Nome completo"
            obrigatorio
            ajuda="Como você quer ser chamado."
          >
            <EntradaTexto
              placeholder="Digite seu nome"
              value={textoLivre}
              onChangeText={setTextoLivre}
            />
          </CampoFormulario>

          <CampoFormulario rotulo="E-mail" obrigatorio>
            <EntradaTexto
              tipo="email"
              placeholder="seu@email.com"
              iconeEsquerda="info"
            />
          </CampoFormulario>

          <CampoFormulario rotulo="Senha" obrigatorio>
            <EntradaTexto tipo="senha" placeholder="••••••••" />
          </CampoFormulario>

          <CampoFormulario
            rotulo="CPF"
            erro="CPF inválido. Confira os dígitos."
          >
            <EntradaTexto
              tipo="numero"
              placeholder="000.000.000-00"
              erro
              defaultValue="123"
            />
          </CampoFormulario>

          <CampoFormulario rotulo="Observação" ajuda="Campo desabilitado.">
            <EntradaTexto
              placeholder="Não pode editar"
              defaultValue="Conteúdo bloqueado"
              editable={false}
            />
          </CampoFormulario>

          <CampoFormulario rotulo="Convênio" obrigatorio>
            <EntradaSelect
              valor={convenio}
              opcoes={[
                { valor: "unimed", rotulo: "Unimed" },
                { valor: "bradesco", rotulo: "Bradesco Saúde" },
                { valor: "amil", rotulo: "Amil" },
                { valor: "particular", rotulo: "Particular" },
              ]}
              aoMudar={setConvenio}
              placeholder="Selecione o convênio"
            />
          </CampoFormulario>

          <CampoFormulario rotulo="Data de nascimento">
            <EntradaData valor={data} aoMudar={setData} />
          </CampoFormulario>
        </Secao>

        <Secao titulo="Avatar e Badge">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.md,
            }}
          >
            <Avatar nome="Mariana Souza" tamanho="sm" />
            <Avatar nome="João Pedro Lima" tamanho="md" />
            <Avatar nome="Carlos Andrade" tamanho="lg" />
            <Avatar nome="Ana Beatriz" tamanho="xl" />
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.sm,
            }}
          >
            <Badge variante="marca">Marca</Badge>
            <Badge variante="sucesso">Sucesso</Badge>
            <Badge variante="erro">Erro</Badge>
            <Badge variante="aviso">Aviso</Badge>
            <Badge variante="info">Info</Badge>
            <Badge variante="neutro">Neutro</Badge>
          </View>
        </Secao>

        <Secao titulo="Ícones">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.lg,
            }}
          >
            {[
              "casa",
              "usuario",
              "medico",
              "calendario",
              "busca",
              "mais",
              "fechar",
              "check",
              "aviso",
              "info",
              "olho",
              "editar",
              "menu",
              "chevronDireita",
              "chevronBaixo",
              "tema",
              "sair",
            ].map((nome) => (
              <View key={nome} style={{ alignItems: "center", gap: 4 }}>
                <Icone nome={nome as never} tamanho={24} />
                <Texto variante="legenda" cor="texto.suave">
                  {nome}
                </Texto>
              </View>
            ))}
          </View>
        </Secao>

        <Secao titulo="Toasts" descricao="Disparam empilhados, auto-dismiss.">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tema.espacamento.sm,
            }}
          >
            <Botao
              rotulo="Sucesso"
              variante="secundario"
              onPress={() =>
                toast.exibir({
                  variante: "sucesso",
                  titulo: "Cliente cadastrado",
                  descricao: "O cliente já aparece na lista.",
                })
              }
            />
            <Botao
              rotulo="Erro"
              variante="secundario"
              onPress={() =>
                toast.exibir({
                  variante: "erro",
                  titulo: "Falha no cadastro",
                  descricao: "Verifique os campos e tente novamente.",
                })
              }
            />
            <Botao
              rotulo="Aviso"
              variante="secundario"
              onPress={() =>
                toast.exibir({
                  variante: "aviso",
                  titulo: "Atenção",
                  descricao: "Sessão expira em 2 minutos.",
                })
              }
            />
            <Botao
              rotulo="Info"
              variante="secundario"
              onPress={() =>
                toast.exibir({
                  variante: "info",
                  titulo: "Sincronizando",
                  descricao: "Atualizando lista de pacientes.",
                })
              }
            />
          </View>
        </Secao>

        <Secao
          titulo="Estados de fluxo"
          descricao="Loading / Sucesso / Erro encadeados num mesmo card."
        >
          <Card preenchimento="lg">
            {estadoFluxo === "ocioso" && (
              <View
                style={{ gap: tema.espacamento.md, alignItems: "center" }}
              >
                <Texto variante="corpo" cor="texto.secundario">
                  Simule um cadastro:
                </Texto>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: tema.espacamento.sm,
                    justifyContent: "center",
                  }}
                >
                  <Botao
                    rotulo="Simular sucesso"
                    variante="primario"
                    onPress={async () => {
                      setEstadoFluxo("carregando");
                      await new Promise((r) => setTimeout(r, 1500));
                      setEstadoFluxo("sucesso");
                    }}
                  />
                  <Botao
                    rotulo="Simular erro"
                    variante="perigo"
                    onPress={async () => {
                      setEstadoFluxo("carregando");
                      await new Promise((r) => setTimeout(r, 1500));
                      setEstadoFluxo("erro");
                    }}
                  />
                </View>
              </View>
            )}
            {estadoFluxo === "carregando" && (
              <EstadoCarregando
                variante="inline"
                mensagem="Cadastrando cliente..."
              />
            )}
            {estadoFluxo === "sucesso" && (
              <EstadoSucesso
                titulo="Cliente cadastrado"
                descricao="O novo cliente já está disponível."
                rotuloAcao="Ver clientes"
                aoExecutarAcao={() => setEstadoFluxo("ocioso")}
              />
            )}
            {estadoFluxo === "erro" && (
              <EstadoErro
                titulo="Cliente não cadastrado"
                descricao="Não conseguimos concluir o cadastro. Verifique os dados e tente novamente."
                detalheTecnico="HTTP 400 — Campo CPF inválido"
                rotuloAcao="Revisar cadastro"
                aoExecutarAcao={() => setEstadoFluxo("ocioso")}
              />
            )}
          </Card>
        </Secao>

        <Secao
          titulo="Listagem de clientes"
          descricao="Composite ItemListaCliente sobre dados mockados."
        >
          <View style={{ gap: tema.espacamento.sm }}>
            {clientesMock.slice(0, 4).map((cliente) => (
              <ItemListaCliente
                key={cliente.identificacao}
                cliente={cliente}
                aoVerPerfil={(c) =>
                  toast.exibir({
                    variante: "info",
                    titulo: "Abrindo perfil",
                    descricao: c.nome,
                  })
                }
                aoEditar={(c) =>
                  toast.exibir({
                    variante: "info",
                    titulo: "Editar cliente",
                    descricao: c.nome,
                  })
                }
              />
            ))}
          </View>
        </Secao>

        <Secao
          titulo="Listagem de médicos"
          descricao="Mesmo composite, adaptado pelo wrapper de domínio."
        >
          <View style={{ gap: tema.espacamento.sm }}>
            {medicosMock.slice(0, 3).map((medico) => (
              <ItemListaMedico
                key={medico.matricula}
                medico={medico}
                aoVerPerfil={(m) =>
                  toast.exibir({
                    variante: "info",
                    titulo: "Abrindo perfil",
                    descricao: m.nome,
                  })
                }
              />
            ))}
          </View>
        </Secao>

        <Secao
          titulo="Calendário do dia"
          descricao="Slots de 30min entre 7h e 19h. Cards encolhem com ellipsize."
        >
          <Card
            preenchimento="nenhum"
            style={{ height: 480, overflow: "hidden" }}
          >
            <CalendarioDia
              data={dataCalendario}
              consultas={consultasHoje}
              aoSelecionarConsulta={(id) =>
                toast.exibir({
                  variante: "info",
                  titulo: "Abrindo consulta",
                  descricao: `Consulta #${id}`,
                })
              }
            />
          </Card>
        </Secao>

        <Divisor />

        <View style={{ alignItems: "center" }}>
          <Texto variante="legenda" cor="texto.suave" alinhamento="center">
            Design System Clínica ·{" "}
            {modo === "claro" ? "Modo claro" : "Modo escuro"}
          </Texto>
        </View>
      </ScrollView>

      {/* BarraInferior fixa */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: insets.bottom,
        }}
      >
        <BarraInferior
          chaveAtiva={chaveBarra}
          aoSelecionar={setChaveBarra}
          itens={[
            { chave: "home", icone: "casa", rotuloAcessivel: "Home" },
            { chave: "busca", icone: "busca", rotuloAcessivel: "Buscar" },
            {
              chave: "agenda",
              icone: "calendario",
              rotuloAcessivel: "Agenda",
            },
            {
              chave: "perfil",
              icone: "usuario",
              rotuloAcessivel: "Perfil",
            },
          ]}
        />
      </View>

      {/* Drawer overlay */}
      <SidebarDrawer
        aberto={drawerAberto}
        aoFechar={() => setDrawerAberto(false)}
        chaveAtiva={chaveSidebar}
        aoSelecionar={(chave) => {
          setChaveSidebar(chave);
          setDrawerAberto(false);
        }}
        grupos={[
          {
            chave: "cliente",
            rotulo: "Cliente",
            icone: "usuario",
            itens: [
              {
                chave: "cliente.cadastrar",
                rotulo: "Cadastrar",
                icone: "mais",
              },
              { chave: "cliente.listar", rotulo: "Listar", icone: "menu" },
            ],
          },
          {
            chave: "medico",
            rotulo: "Médico",
            icone: "medico",
            itens: [
              {
                chave: "medico.cadastrar",
                rotulo: "Cadastrar",
                icone: "mais",
              },
              { chave: "medico.listar", rotulo: "Listar", icone: "menu" },
            ],
          },
          {
            chave: "consulta",
            rotulo: "Consultas",
            icone: "calendario",
            itens: [
              {
                chave: "consulta.agenda",
                rotulo: "Agenda do dia",
                icone: "calendario",
              },
            ],
          },
        ]}
        cabecalho={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tema.espacamento.sm,
            }}
          >
            <MarcaApp tamanho={32} />
            <Texto variante="corpo" peso="negrito">
              Clínica
            </Texto>
          </View>
        }
        rodape={
          <View style={{ gap: tema.espacamento.sm }}>
            <Botao
              rotulo={modo === "claro" ? "Modo escuro" : "Modo claro"}
              variante="fantasma"
              iconeEsquerda="tema"
              tamanho="sm"
              onPress={alternar}
            />
            {aoSair && (
              <Botao
                rotulo="Sair"
                variante="fantasma"
                iconeEsquerda="sair"
                tamanho="sm"
                onPress={() => {
                  setDrawerAberto(false);
                  aoSair();
                }}
              />
            )}
          </View>
        }
      />
    </View>
  );
}

function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  const { tema } = useTema();
  return (
    <View style={{ gap: tema.espacamento.md }}>
      <View>
        <Texto variante="h3" peso="negrito">
          {titulo}
        </Texto>
        {descricao && (
          <Texto variante="legenda" cor="texto.suave">
            {descricao}
          </Texto>
        )}
      </View>
      <View style={{ gap: tema.espacamento.md }}>{children}</View>
    </View>
  );
}
