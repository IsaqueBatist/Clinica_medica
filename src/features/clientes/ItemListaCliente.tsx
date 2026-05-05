import React from "react";

import { STATUS_PESSOA_LABEL } from "../../constants/pessoa";
import type { Cliente } from "../../types/models/cliente.type";
import { ItemListaPessoa } from "../pessoas/ItemListaPessoa";

/**
 * ItemListaCliente — adapta o composite `ItemListaPessoa` ao domínio Cliente.
 * Aqui é onde o conhecimento "convênio é a linha extra do cliente" vive — a UI
 * crua não sabe disso.
 */

export interface PropsItemListaCliente {
  cliente: Cliente;
  aoVerPerfil?: (cliente: Cliente) => void;
  aoEditar?: (cliente: Cliente) => void;
}

export function ItemListaCliente({
  cliente,
  aoVerPerfil,
  aoEditar,
}: PropsItemListaCliente) {
  const linhaExtra = cliente.convenio
    ? `Convênio: ${cliente.convenio.nome}`
    : "Particular";

  return (
    <ItemListaPessoa
      identificacao={cliente.identificacao}
      nome={cliente.nome}
      linhaExtra={linhaExtra}
      rotuloStatus={STATUS_PESSOA_LABEL[cliente.status]}
      varianteStatus={cliente.status === "ativo" ? "sucesso" : "neutro"}
      aoVerPerfil={aoVerPerfil ? () => aoVerPerfil(cliente) : undefined}
      aoEditar={aoEditar ? () => aoEditar(cliente) : undefined}
    />
  );
}
