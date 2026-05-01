/**
 * Escala de espaçamento. Múltiplos de 4 apenas — escala restrita força
 * consistência. Não adicione valores fora dessa lista; se um caso específico
 * pedir 6px ou 18px, prefira o múltiplo de 4 mais próximo (4 ou 16).
 *
 * Convenção t-shirt size: xs/sm/md/lg/xl/2xl/3xl.
 *
 * Uso típico:
 *  - padding interno de input/botão : md (12) ou lg (16)
 *  - gap entre cards               : md (12)
 *  - margem de tela (mobile)        : lg (16)
 *  - espaço entre seções            : 2xl (32)
 */

export const espacamento = {
  nenhum: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export type ChaveEspacamento = keyof typeof espacamento;
