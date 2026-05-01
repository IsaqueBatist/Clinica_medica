/**
 * Raios de borda.
 *
 * `lg` (12) é o padrão para cards e botões — coerente com o ícone do app,
 * que tem cantos generosos. `completo` para avatares, pills, FAB.
 */

export const raios = {
  nenhum: 0,
  sm: 4,
  md: 8,
  lg: 12,
  completo: 9999,
} as const;

export type ChaveRaio = keyof typeof raios;
