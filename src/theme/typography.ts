/**
 * Tokens de tipografia.
 *
 * Tamanhos intencionalmente curtos (legenda, corpo, h3, h2, h1) — sem h4/h5/h6
 * porque telas mobile raramente justificam essa hierarquia toda.
 *
 * Pesos restritos a 3: regular (400), medio (500), negrito (700). Sem 600/800.
 * Cada peso adicional é um arquivo de fonte a mais no bundle.
 *
 * Uso:
 *  - corpo de texto              : corpo / regular
 *  - labels de form, botões       : corpo / medio
 *  - timestamps, captions         : legenda / regular
 *  - títulos de seção             : h3 / negrito
 *  - títulos de tela              : h1 ou h2 / negrito
 */

export const tipografia = {
  tamanho: {
    legenda: 12,
    corpo: 16,
    h3: 20,
    h2: 24,
    h1: 32,
  },
  alturaLinha: {
    legenda: 16,
    corpo: 24,
    h3: 28,
    h2: 32,
    h1: 40,
  },
  peso: {
    regular: "400",
    medio: "500",
    negrito: "700",
  },
  familia: {
    sans: "Inter",
    mono: "JetBrains Mono",
  },
} as const;

export type ChaveTamanhoFonte = keyof typeof tipografia.tamanho;
export type ChavePesoFonte = keyof typeof tipografia.peso;
