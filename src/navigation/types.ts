import type { NomeIcone } from "../components/ui/Icone";
import { Routes } from "../constants/routes";
import type { NavigatorScreenParams } from "@react-navigation/native";

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

export type DashboardStackParamList = {
  [Routes.Dashboard]: undefined;
};

export type ClientesStackParamList = {
  [Routes.ListarClientes]: undefined;
  [Routes.CadastroCliente]: { id?: string };
  [Routes.DetalheCliente]: { id: string };
};

export type ConsultasStackParamList = {
  [Routes.ConsultaMarcacao]: undefined;
  [Routes.ListarConsultas]: undefined;
  [Routes.ConsultaConfirmacao]: undefined;
  [Routes.ConsultaRealizacao]: undefined;
  [Routes.ConsultaEncerramento]: undefined;
  [Routes.ConsultaCancelamento]: undefined;
  [Routes.DetalheConsulta]: { id: string };
};

export type MedicosStackParamList = {
  [Routes.ListarMedicos]: undefined;
  [Routes.CadastroMedico]: { id?: string };
  [Routes.DetalheMedico]: { id: string };
};

export type DrawerParamList = {
  [Routes.DashboardStack]: NavigatorScreenParams<DashboardStackParamList>;
  [Routes.ClientesStack]: NavigatorScreenParams<ClientesStackParamList>;
  [Routes.ConsultasStack]: NavigatorScreenParams<ConsultasStackParamList>;
  [Routes.MedicosStack]: NavigatorScreenParams<MedicosStackParamList>;
};

/** Subitem dentro de um grupo do drawer. */
export interface SubItemDrawer {
  stack: keyof DrawerParamList;
  tela: string;
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
    nome: Routes.DashboardStack,
    rotulo: "Início",
    icone: "casa",
  },
  {
    tipo: "grupo",
    chave: "cliente",
    rotulo: "Clientes",
    icone: "usuario",
    itens: [
      {
        stack: Routes.ClientesStack,
        tela: Routes.CadastroCliente,
        rotulo: "Cadastrar",
        icone: "mais",
      },
      {
        stack: Routes.ClientesStack,
        tela: Routes.ListarClientes,
        rotulo: "Listar",
        icone: "menu",
      },
    ],
  },
  {
    tipo: "grupo",
    chave: "consulta",
    rotulo: "Consultas",
    icone: "calendario",
    itens: [
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ConsultaMarcacao,
        rotulo: "Marcar",
        icone: "mais",
      },
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ListarConsultas,
        rotulo: "Listar",
        icone: "menu",
      },
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ConsultaConfirmacao,
        rotulo: "Confirmar",
        icone: "check",
      },
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ConsultaRealizacao,
        rotulo: "Realizar",
        icone: "calendario",
      },
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ConsultaEncerramento,
        rotulo: "Encerrar",
        icone: "editar",
      },
      {
        stack: Routes.ConsultasStack,
        tela: Routes.ConsultaCancelamento,
        rotulo: "Cancelar",
        icone: "fechar",
      },
    ],
  },
  {
    tipo: "grupo",
    chave: "medicos",
    rotulo: "Médicos",
    icone: "usuario",
    itens: [
      {
        stack: Routes.MedicosStack,
        tela: Routes.CadastroMedico,
        rotulo: "Cadastrar",
        icone: "mais",
      },
      {
        stack: Routes.MedicosStack,
        tela: Routes.ListarMedicos,
        rotulo: "Listar",
        icone: "menu",
      },
    ],
  },
];
