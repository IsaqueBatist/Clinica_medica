/**
 * API pública do tema. Importe daqui:
 *
 *   import { ProvedorTema, coresClaras } from '@/theme';
 *   import { useTema } from '@/hooks/useTema';
 *
 * Não importe arquivos internos diretamente (`@/theme/colors`) — passa por
 * aqui para mantermos liberdade de reorganizar a estrutura interna.
 */

export { coresClaras, coresEscuras } from "./colors";
export { espacamento } from "./spacing";
export { tipografia } from "./typography";
export { raios } from "./radii";

export { ProvedorTema, ContextoTema } from "../contexts/ContextoTema";
export type { ValorContextoTema } from "../contexts/ContextoTema";

export type {
  Tema,
  ModoTema,
  Espacamento,
  Tipografia,
  Raios,
} from "../types/tema.type";
export type { PaletaCores } from "../types/paletaCores.type";
