import { z } from 'zod';

export const clienteFormSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    dataNascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().min(14, 'Telefone incompleto'),
    endereco: z.object({
        logradouro: z.string().min(1, 'Obrigatório'),
        numero: z.string().min(1, 'Obrigatório'),
        complemento: z.string().optional(),
        bairro: z.string().min(1, 'Obrigatório'),
        cidade: z.string().min(1, 'Obrigatório'),
        estado: z.string().length(2, 'UF'),
    }),
    // Novos campos baseados no Figma
    convenio: z.object({
        nome: z.string().optional(),
        matricula: z.string().optional(),
    }).optional(),
});

export type ClienteFormValues = z.infer<typeof clienteFormSchema>;