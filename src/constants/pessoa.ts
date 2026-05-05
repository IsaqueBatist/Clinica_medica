export const STATUS_PESSOA = {
  ATIVO: "ativo",
  INATIVO: "inativo",
} as const;
export type StatusPessoa = (typeof STATUS_PESSOA)[keyof typeof STATUS_PESSOA];

export const STATUS_PESSOA_LABEL = {
  ativo: "Ativo",
  inativo: "Inativo",
} as const satisfies Record<StatusPessoa, string>;

export const SEXO = {
  MASCULINO: "M",
  FEMININO: "F",
  OUTRO: "outro",
} as const;
export type Sexo = (typeof SEXO)[keyof typeof SEXO];

export const SEXO_LABEL = {
  M: "Masculino",
  F: "Feminino",
  outro: "Outro",
} as const satisfies Record<Sexo, string>;
