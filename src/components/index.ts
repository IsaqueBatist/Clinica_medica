/**
 * API pública da camada de componentes. Importe daqui:
 *
 *   import { Botao, Card, Toast, Sidebar } from "@/components";
 *
 * As três sub-camadas (ui / feedback / navegacao) são re-exportadas em peso
 * igual — quem consome não precisa saber em qual pasta cada componente vive.
 *
 * Componentes de domínio (cliente, médico, consulta) NÃO entram aqui — vivem
 * em `src/features/*` e são importados explicitamente onde fazem sentido.
 */

export * from "./feedback";
export { FormScreen, type PropsFormScreen } from "./FormScreen";
export {
  FiltrosConsulta,
  type ModoFiltrosConsulta,
  type PropsFiltrosConsulta,
} from "./FiltrosConsulta";
export * from "./navegacao";
export * from "./ui";
