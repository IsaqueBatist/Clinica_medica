import React, { useState, useEffect } from "react";

import { EntradaTexto, type PropsEntradaTexto } from "../EntradaTexto";

/**
 * EntradaData — input de data com máscara DD/MM/AAAA. Sem componente nativo
 * de date picker (evitamos a dependência) — o usuário digita ou cola.
 *
 * Design decision: trabalhamos sempre em string formatada no nível do input;
 * o componente pai converte para Date quando precisar (helper exportado).
 *
 * Para um date-picker visual completo, use junto a um Modal com calendário
 * customizado — não cobrimos aqui pra manter este input enxuto.
 */

function aplicarMascara(bruto: string): string {
  const digitos = bruto.replace(/\D/g, "").slice(0, 8);
  const partes: string[] = [];
  if (digitos.length >= 1) partes.push(digitos.slice(0, 2));
  if (digitos.length >= 3) partes.push(digitos.slice(2, 4));
  if (digitos.length >= 5) partes.push(digitos.slice(4, 8));
  return partes.join("/");
}

/** Converte "DD/MM/AAAA" → Date | null. Retorna null se inválido/incompleto. */
export function parsearDataBR(valor: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]) - 1;
  const ano = Number(m[3]);
  const d = new Date(ano, mes, dia);
  // Verifica se a data "rolou" (ex: 31/02 vira 03/03 em new Date).
  if (
    d.getFullYear() !== ano ||
    d.getMonth() !== mes ||
    d.getDate() !== dia
  ) {
    return null;
  }
  return d;
}

export interface PropsEntradaData
  extends Omit<PropsEntradaTexto, "tipo" | "value" | "onChangeText" | "onChange"> {
  valor: string;
  aoMudar: (valor: string) => void;
}

export function EntradaData({ valor, aoMudar, ...rest }: PropsEntradaData) {
  // O state local mantém a string sincronizada com o que o parent passou e
  // ainda permite digitação livre — evita disparo de mascaramento "perdendo
  // o cursor" em cada tecla quando o pai re-renderiza.
  const [interno, setInterno] = useState<string>(aplicarMascara(valor));

  useEffect(() => {
    setInterno(aplicarMascara(valor));
  }, [valor]);

  return (
    <EntradaTexto
      tipo="numero"
      placeholder="DD/MM/AAAA"
      value={interno}
      onChangeText={(t) => {
        const mascarado = aplicarMascara(t);
        setInterno(mascarado);
        aoMudar(mascarado);
      }}
      maxLength={10}
      {...rest}
    />
  );
}
