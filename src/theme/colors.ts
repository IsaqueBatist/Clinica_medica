/**
 * Tokens de cor. Os componentes nunca devem ler hex direto — sempre via
 * `useTema().tema.cores.*`.
 *
 * Paleta-mestra (extraída do ícone do app — `assets/images/icon.png`):
 *   - laranja peach (#e89d68)  → identidade visual / accent
 *   - laranja saturado (#f97316) → ações de alta visibilidade
 *   - laranja profundo (#c2410c) → primário (passa AA com texto branco)
 *
 * Neutros são *warm* (creme/marrom) pra harmonizar com o laranja — neutros
 * frios (cinza-azulado) "brigariam" com a marca.
 *
 * Decisão sobre `marca.primario` vs `marca.secundario`:
 *  - `primario` é a cor de fundo de botão CTA. Precisa passar contraste WCAG
 *    AA com texto branco. Por isso é laranja-700 (#c2410c) no claro.
 *  - `secundario` é a cor "marca" pura — o tom do plus do ícone (#f97316).
 *    Use em accents, ícones, ilustrações. NÃO use para texto sobre branco
 *    (falha contraste).
 */

import { PaletaCores } from "../types/paletaCores.type";

export const coresClaras: PaletaCores = {
  fundo: {
    primario: "#faf6f0", // canvas — creme quente, harmoniza com laranja
    secundario: "#f4ede0", // surface alternativa
    superficie: "#ffffff", // cards, modais, bottom sheets
    suave: "#f0e6d4", // chips, inputs disabled, hover neutro
  },
  texto: {
    primario: "#2a1a0d", // marrom muito escuro — contraste forte sobre creme
    secundario: "#5e4937",
    suave: "#8c7864",
    inverso: "#ffffff", // texto em superfícies escuras
    sobreMarca: "#ffffff", // texto sobre marca.primario (#c2410c → 5.6:1 AA)
  },
  borda: {
    padrao: "#e8dcc4",
    forte: "#d4c2a0",
    foco: "#f97316", // ring de foco — laranja saturado pra destacar
  },
  status: {
    sucesso: "#10b981",
    erro: "#dc2626",
    aviso: "#f59e0b",
    info: "#0284c7", // info azul (não compete com a marca laranja)
    neutro: "#8c7864",
  },
  marca: {
    primario: "#c2410c", // laranja profundo — ação principal (AA c/ branco)
    secundario: "#f97316", // laranja vibrante — accent / ícones / ilustrações
  },
};

export const coresEscuras: PaletaCores = {
  fundo: {
    primario: "#1a1310", // canvas — marrom muito escuro
    secundario: "#251c17", // surface alternativa
    superficie: "#2d231c", // cards, modais
    suave: "#3a2d24", // chips, inputs disabled
  },
  texto: {
    primario: "#faf6f0",
    secundario: "#d4c2a0",
    suave: "#a08d7a",
    inverso: "#1a1310",
    // laranja claro + texto escuro = contraste seguro (~7:1)
    sobreMarca: "#1a1310",
  },
  borda: {
    padrao: "#3a2d24",
    forte: "#4d3d31",
    foco: "#fb923c", // laranja-400 — visibilidade extra em fundo escuro
  },
  status: {
    sucesso: "#34d399",
    erro: "#f87171",
    aviso: "#fbbf24",
    info: "#38bdf8",
    neutro: "#a08d7a",
  },
  marca: {
    primario: "#f97316", // laranja vibrante — em escuro vira a ação principal
    secundario: "#fb923c", // laranja-400 — accent suave
  },
};
