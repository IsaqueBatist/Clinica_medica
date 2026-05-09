# 📸 Guia de Screenshots

Este arquivo descreve como adicionar screenshots ao README.

## Estrutura de Diretórios

```
assets/
└── screenshots/
    ├── 01-login.png                    # Tela de login
    ├── 02-cadastro.png                 # Tela de cadastro
    ├── 03-selecao-cliente.png          # Tela de seleção de cliente
    ├── 04-step1-cliente.png            # Marcação: Step 1 - Seleção de Cliente
    ├── 05-step2-especialidade.png      # Marcação: Step 2 - Seleção de Especialidade
    ├── 06-step3-medico.png             # Marcação: Step 3 - Seleção de Médico
    ├── 07-step4-agenda.png             # Marcação: Step 4 - Seleção de Data/Hora
    ├── 08-step5-resumo.png             # Marcação: Step 5 - Resumo e Confirmação
    ├── 09-confirmacao.png              # Tela de confirmação de consulta
    ├── 10-realizacao.png               # Tela de realização da consulta
    ├── 11-encerramento.png             # Tela de encerramento da consulta
    └── 12-cancelamento.png             # Tela de cancelamento de consulta
```

## Como Capturar Screenshots

### No Android Emulator

1. Abrir Expo: `npm start` → escolher Android
2. Na tela do emulador, usar **Ctrl + Shift + S** (ou via menu)
3. As imagens são salvas automaticamente

### No iOS Simulator (macOS)

1. Abrir Expo: `npm start` → escolher iOS
2. Usar **Cmd + S** para capturar

### No Expositor Web

1. Abrir devtools do navegador (F12)
2. Usar ferramenta de captura nativa do navegador

## Formato e Especificações

- **Formato:** PNG
- **Resolução:** 1080x1920px (padrão mobile vertical)
- **Tamanho:** ~100-300KB por imagem
- **Proporção:** 9:16 (portrait)

## Nomeação

Seguir padrão numérico e descritivo:

- `01-login.png` (login)
- `02-cadastro.png` (cadastro)
- etc.

Manter nomes em **minúsculas** com **hífens** entre palavras.

## Atualizar README

Uma vez que os screenshots estão no diretório `assets/screenshots/`, o README.md já está configurado para exibi-los automaticamente.

**Não é necessário fazer nenhuma alteração** — as imagens aparecerão automaticamente no GitHub/GitLab quando fizerem o commit.

## Validação

Após fazer commit das imagens:

1. Fazer push para remoto: `git push`
2. Abrir o repositório no GitHub
3. Verificar que as imagens aparecem na seção "Screenshots" do README

Se as imagens não aparecerem, verificar:

- Nome dos arquivos está correto (case-sensitive em Linux/Mac)
- Caminho no README está correto: `./assets/screenshots/XX-nome.png`
- Arquivo é PNG válido
- Pode ser necessário fazer refresh da página

---

**Criado para:** [Clínica Médica - App de Agendamento](https://github.com/IsaqueBatist/Clinica_medica)
