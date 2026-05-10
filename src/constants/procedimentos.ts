export const PROCEDIMENTOS = [
  "Consulta padrão",
  "Exame clínico",
  "Curativo",
] as const;
export type Procedimento = (typeof PROCEDIMENTOS)[number];
