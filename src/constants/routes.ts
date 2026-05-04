export const Routes = {
  Login: "Login",
  Autenticado: "Autenticado",

  Dashboard: "Dashboard",
  ConsultaConfirmacao: "ConsultaConfirmacao",
  ConsultaRealizacao: "ConsultaRealizacao",
  ConsultaEncerramento: "ConsultaEncerramento",
  ConsultaCancelamento: "ConsultaCancelamento",

  AgendaSemana: "AgendaSemana",
  ConsultaMarcacao: "ConsultaMarcacao",

  ListaCliente: "ListaCliente",
  CadastroCliente: "CadastroCliente",
  DetalheCliente: "DetalheCliente",
} as const;
export type RouteName = (typeof Routes)[keyof typeof Routes];