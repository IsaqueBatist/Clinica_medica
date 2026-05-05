import React from "react";

import { STATUS_PESSOA_LABEL } from "../../constants/pessoa";
import type { Medico } from "../../types/models/medico.type";
import { ItemListaPessoa } from "../pessoas/ItemListaPessoa";

export interface PropsItemListaMedico {
  medico: Medico;
  aoVerPerfil?: (medico: Medico) => void;
  aoEditar?: (medico: Medico) => void;
}

export function ItemListaMedico({
  medico,
  aoVerPerfil,
  aoEditar,
}: PropsItemListaMedico) {
  const linhaExtra = `${medico.especialidade.nome} · ${medico.crm}`;

  return (
    <ItemListaPessoa
      identificacao={medico.matricula}
      nome={medico.nome}
      linhaExtra={linhaExtra}
      rotuloStatus={STATUS_PESSOA_LABEL[medico.status]}
      varianteStatus={medico.status === "ativo" ? "sucesso" : "neutro"}
      aoVerPerfil={aoVerPerfil ? () => aoVerPerfil(medico) : undefined}
      aoEditar={aoEditar ? () => aoEditar(medico) : undefined}
    />
  );
}
