import type { NomeIcone } from "../components/ui/Icone";
import { Routes } from "../constants/routes";

/**
 * Tipagem das rotas do Drawer raiz.
 *
 * IMPORTANTE: o Drawer do react-navigation é FLAT — não aceita rotas aninhadas.
 * Por isso aqui listamos cada destino individual (Cadastrar, Listar, ...).
 * A *hierarquia visual* (grupo "Cliente" com filhos "Cadastrar"/"Listar") vive
 * em `ENTRADAS_DRAWER` mais abaixo e é puramente apresentacional.
 *
 * `undefined` significa "rota sem parâmetros". Quando uma rota receber params
 * (ex: editar cliente precisa do `id`), troque por `{ id: string }` e o
 * `navigation.navigate` passa a exigir o parâmetro tipado.
 */
export type DrawerParamList = {
  [Routes.Dashboard]: undefined;
  [Routes.CadastroCliente]: undefined;
  [Routes.ListarClientes]: undefined;
  [Routes.ListarConsultas]: undefined;
  [Routes.ConsultaMarcacao]: undefined;
  [Routes.ConsultaConfirmacao]: undefined;
  [Routes.ConsultaRealizacao]: undefined;
  [Routes.ConsultaEncerramento]: undefined;
  [Routes.ConsultaCancelamento]: undefined;
};

/** Subitem dentro de um grupo do drawer. */
export interface SubItemDrawer {
  nome: keyof DrawerParamList;
  rotulo: string;
  icone?: NomeIcone;
}

/**
 * Entrada do drawer: ou um item solto (ex: Início) ou um grupo expansível
 * com filhos (ex: Clientes → Cadastrar / Listar).
 *
 * Discriminated union pelo campo `tipo` — o TS estreita o resto dos campos
 * automaticamente em cada branch (`if (e.tipo === "grupo") e.itens` valida).
 */
export type EntradaDrawer =
  | {
      tipo: "item";
      nome: keyof DrawerParamList;
      rotulo: string;
      icone: NomeIcone;
    }
  | {
      tipo: "grupo";
      chave: string;
      rotulo: string;
      icone: NomeIcone;
      itens: SubItemDrawer[];
    };

/**
 * Estrutura visual do drawer. Para adicionar uma seção:
 *  1. Garanta que cada `nome` exista em `DrawerParamList` acima.
 *  2. Registre o `Drawer.Screen` correspondente em `DrawerNavigator.tsx`.
 *  3. Pronto — a entrada aparece automaticamente na gaveta.
 */
export const ENTRADAS_DRAWER: EntradaDrawer[] = [
  {
    tipo: "item",
    nome: Routes.Dashboard,
    rotulo: "Início",
    icone: "casa",
  },
  {
    tipo: "grupo",
    chave: "cliente",
    rotulo: "Clientes",
    icone: "usuario",
    itens: [
      { nome: Routes.CadastroCliente, rotulo: "Cadastrar", icone: "mais" },
      { nome: Routes.ListarClientes, rotulo: "Listar", icone: "menu" },
    ],
  },
  {
    tipo: "grupo",
    chave: "consulta",
    rotulo: "Consultas",
    icone: "calendario",
    itens: [
      { nome: Routes.ListarConsultas, rotulo: "Listar", icone: "menu" },
      { nome: Routes.ConsultaMarcacao, rotulo: "Marcar", icone: "mais" },
      { nome: Routes.ConsultaConfirmacao, rotulo: "Confirmar", icone: "check" },
      {
        nome: Routes.ConsultaRealizacao,
        rotulo: "Realizar",
        icone: "calendario",
      },
      {
        nome: Routes.ConsultaEncerramento,
        rotulo: "Encerrar",
        icone: "editar",
      },
      {
        nome: Routes.ConsultaCancelamento,
        rotulo: "Cancelar",
        icone: "fechar",
      },
    ],
  },
];
