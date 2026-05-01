/**
 * Tipos centrais do tema.
 * O `PaletaCores` é derivado de `coresClaras` (typeof) — isso garante,
 * em compile-time, que `coresEscuras` tenha exatamente as mesmas chaves.
 */

import type { coresClaras } from './colors';
import type { espacamento } from './spacing';
import type { tipografia } from './typography';
import type { raios } from './radii';

export type PaletaCores = typeof coresClaras;
export type Espacamento = typeof espacamento;
export type Tipografia = typeof tipografia;
export type Raios = typeof raios;

export type ModoTema = 'claro' | 'escuro';

/**
 * Forma final do tema exposta pelo `useTema()`.
 * Componentes consomem isto: `const { cores, espacamento } = useTema().tema;`
 */
export interface Tema {
  cores: PaletaCores;
  espacamento: Espacamento;
  tipografia: Tipografia;
  raios: Raios;
}
