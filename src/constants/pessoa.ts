export const STATUS_PESSOA = ["ativo", "inativo"] as const;
export type StatusPessoa = (typeof STATUS_PESSOA)[number];

export const STATUS_PESSOA_LABEL: Record<StatusPessoa, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
};

export const SEXO = ["M", "F", "outro"] as const;
export type Sexo = (typeof SEXO)[number];

export const SEXO_LABEL: Record<Sexo, string> = {
  M: "Masculino",
  F: "Feminino",
  outro: "Outro",
};
