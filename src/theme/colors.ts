/**
 * Tokens de cor. Os componentes nunca devem ler hex direto — sempre via
 * `useTema().tema.cores.*`.
 *
 * Estrutura:
 *  - fundo  : superfícies (canvas, surface, raised, muted)
 *  - texto  : tipografia (com `sobreMarca` para texto sobre botões primários)
 *  - borda  : bordas e separadores
 *  - status : feedback semântico (sucesso/erro/aviso/info)
 *  - marca  : identidade do app (primário = ação acessível, secundário = accent)
 *
 * Decisão sobre `marca.primario` vs `marca.secundario`:
 *  - `primario` é a cor usada em fundos de botão e textos sobre branco. Precisa
 *    passar contraste WCAG AA. Por isso é primary-700 (#B5530E) em claro.
 *  - `secundario` é a cor "marca" pura (cor da cruz no ícone, primary-500).
 *    Use para ícones, accents, ilustrações — *não* para texto sobre branco.
 */

import { Tema } from "../types/theme";

export const coresClaras: Tema = {
  fundo: {
    primario: "#FAFAF9", // canvas (fundo de tela)
    secundario: "#FFFFFF", // surface secundária (em alguns layouts)
    superficie: "#FFFFFF", // cards, modais, bottom sheets
    suave: "#F5F4F2", // chips, inputs disabled, hover states neutros
  },
  texto: {
    primario: "#1A1815", // texto principal
    secundario: "#56524C", // labels, descrições
    suave: "#78736B", // captions, timestamps, helper text
    inverso: "#FAFAF9", // texto em superfícies escuras (toasts, tooltips)
    sobreMarca: "#FFFFFF", // texto sobre botões primários
  },
  borda: {
    padrao: "#E8E6E1",
    forte: "#D4D1CB", // separadores enfáticos, borda de input
    foco: "#D86714", // ring de foco em inputs
  },
  status: {
    sucesso: "#10B981",
    erro: "#DC2626",
    aviso: "#F59E0B",
    info: "#3B82F6",
    neutro: "#78736B",
  },
  marca: {
    primario: "#B5530E", // botões primários (passa AA com texto branco)
    secundario: "#F47B20", // accent, ícones, ilustrações (cor da cruz do ícone)
  },
};

export const coresEscuras: Tema = {
  fundo: {
    primario: "#1A1815", // canvas
    secundario: "#27251F", // surfaces secundárias
    superficie: "#27251F", // cards, modais
    suave: "#3D3A36", // chips, inputs disabled
  },
  texto: {
    primario: "#FAFAF9",
    secundario: "#D4D1CB",
    suave: "#A8A49C",
    inverso: "#1A1815",
    sobreMarca: "#1A1815", // em escuro, primário é primary-500 (claro), texto preto
  },
  borda: {
    padrao: "#3D3A36",
    forte: "#56524C",
    foco: "#FA8F33", // primary-400, mais visível em escuro
  },
  status: {
    sucesso: "#34D399", // 1-2 stops mais claro p/ contraste em fundo escuro
    erro: "#F87171",
    aviso: "#FBBF24",
    info: "#60A5FA",
    neutro: "#A8A49C",
  },
  marca: {
    primario: "#F47B20", // primary-500 — vibrante, contraste com texto preto
    secundario: "#FFAD66", // primary-300 — accent suave em escuro
  },
};
