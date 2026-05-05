/**
 * Tipos centrais do tema.
 */

import type { PaletaCores } from "./paletaCores.type";
import type { espacamento } from "../theme/spacing";
import type { tipografia } from "../theme/typography";
import type { raios } from "../theme/radii";

export type Espacamento = typeof espacamento;
export type Tipografia = typeof tipografia;
export type Raios = typeof raios;

export type ModoTema = "claro" | "escuro";

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
