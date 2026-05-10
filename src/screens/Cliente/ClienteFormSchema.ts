import { z } from "zod";

const cpfSchema = z
  .string()
  .min(14, "CPF incompleto")
  .refine((cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpfLimpo)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(cpfLimpo[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== Number(cpfLimpo[9])) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(cpfLimpo[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    return resto === Number(cpfLimpo[10]);
  }, "CPF inválido");

const baseSchema = {
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),

  telefone: z.string().min(14, "Telefone incompleto"),
};

export const clienteCadastroSchema = z.object({
  ...baseSchema,

  cpf: cpfSchema,
});

export const clienteEdicaoSchema = z.object({
  ...baseSchema,

  email: z.string().email("E-mail inválido").optional().or(z.literal("")),

  dataNascimento: z.string().optional().or(z.literal("")),

  endereco: z
    .object({
      logradouro: z.string(),

      numero: z.string(),

      complemento: z.string().optional(),

      bairro: z.string(),

      cidade: z.string(),

      estado: z.string(),
    })
    .optional(),

  convenio: z
    .object({
      nome: z.string().optional(),

      matricula: z.string().optional(),
    })
    .optional(),
});

export type ClienteCadastroFormValues = z.infer<typeof clienteCadastroSchema>;

export type ClienteEdicaoFormValues = z.infer<typeof clienteEdicaoSchema>;
