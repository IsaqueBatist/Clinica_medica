import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FormScreen } from "../../components/FormScreen";
import { useTema } from "../../hooks/useTema";
import { useToast } from "../../hooks/useToast";
import { Botao } from "../../components/ui/Botao";
import { CampoFormulario } from "../../components/ui/CampoFormulario";
import { EntradaTexto } from "../../components/ui/EntradaTexto";
import { MarcaApp } from "../../components/ui/MarcaApp";
import { Texto } from "../../components/ui/Texto";
import { useContextCliente } from "../../hooks";

/**
 * TelaLogin — exemplo de uso integrado: form, validação local, loading,
 * feedback de erro inline e toast de sucesso.
 *
 * A "validação" aqui é didática (regex de email + senha mínima); em produção
 * deve viver num hook dedicado ou library como zod.
 */

export interface PropsTelaLogin {
  aoEntrar: () => void;
}

export function TelaLogin({ aoEntrar }: PropsTelaLogin) {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const toast = useToast();
  const { state } = useContextCliente();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<{
    email?: string;
    senha?: string;
    geral?: string;
  }>({});

  function validar(): boolean {
    const novos: typeof erros = {};
    if (!email) novos.email = "Informe seu e-mail.";
    else if (!/.+@.+\..+/.test(email)) novos.email = "E-mail inválido.";
    if (!senha) novos.senha = "Informe sua senha.";
    else if (senha.length < 6)
      novos.senha = "Senha deve ter ao menos 6 caracteres.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  async function entrar() {
    if (!validar()) return;
    setEnviando(true);
    setErros({});
    try {
      // Mock: simula latência. Use senha "errada" para forçar erro.
      await new Promise((r) => setTimeout(r, 1000));
      if (senha === "errada") {
        throw new Error("Credenciais inválidas. Verifique e-mail e senha.");
      }
      toast.exibir({
        variante: "sucesso",
        titulo: "Bem-vindo",
        descricao: "Login efetuado com sucesso.",
      });
      aoEntrar();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao entrar.";
      setErros({ geral: msg });
    } finally {
      setEnviando(false);
    }
  }

  useEffect(() => {
    console.log(state);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.cores.fundo.primario,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <FormScreen
        contentContainerStyle={{
          justifyContent: "center",
          padding: tema.espacamento.xl,
        }}
      >
        <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: 420,
              gap: tema.espacamento.xl,
            }}
          >
            <View style={{ alignItems: "center", gap: tema.espacamento.sm }}>
              <MarcaApp tamanho={64} />
              <Texto variante="h2" peso="negrito" alinhamento="center">
                Clínica
              </Texto>
              <Texto
                variante="corpo"
                cor="texto.secundario"
                alinhamento="center"
              >
                Entre com sua conta para continuar
              </Texto>
            </View>

            <View
              style={{
                gap: tema.espacamento.lg,
                backgroundColor: tema.cores.fundo.superficie,
                padding: tema.espacamento.xl,
                borderRadius: tema.raios.lg,
                borderWidth: 1,
                borderColor: tema.cores.borda.padrao,
              }}
            >
              <CampoFormulario rotulo="E-mail" obrigatorio erro={erros.email}>
                <EntradaTexto
                  tipo="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  erro={!!erros.email}
                  editable={!enviando}
                />
              </CampoFormulario>

              <CampoFormulario
                rotulo="Senha"
                obrigatorio
                erro={erros.senha}
                ajuda="Mínimo 6 caracteres."
              >
                <EntradaTexto
                  tipo="senha"
                  placeholder="••••••••"
                  value={senha}
                  onChangeText={setSenha}
                  erro={!!erros.senha}
                  editable={!enviando}
                />
              </CampoFormulario>

              {erros.geral && (
                <View
                  style={{
                    padding: tema.espacamento.md,
                    borderRadius: tema.raios.md,
                    backgroundColor: tema.cores.fundo.suave,
                    borderLeftWidth: 3,
                    borderLeftColor: tema.cores.status.erro,
                  }}
                >
                  <Texto variante="legenda" cor="status.erro" peso="medio">
                    {erros.geral}
                  </Texto>
                </View>
              )}

              <Botao
                rotulo="Entrar"
                variante="primario"
                tamanho="lg"
                larguraTotal
                carregando={enviando}
                onPress={entrar}
              />
            </View>

            <Texto variante="legenda" cor="texto.suave" alinhamento="center">
              Dica: digite a senha "errada" para ver o estado de erro.
            </Texto>
          </View>
      </FormScreen>
    </View>
  );
}
