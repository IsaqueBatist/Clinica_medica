import { z } from 'zod';

export const medicoFormSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    crm: z.string().regex(/^\d{4,10}-[A-Z]{2}$/, 'Formato inválido (Ex: 12345-SP)'),
    especialidades: z.string().min(3, 'Especialidade é obrigatória'), // Simplificado para texto por enquanto
    status: z.enum(['ativo', 'inativo']).default('ativo'),
});

export type MedicoFormValues = z.infer<typeof medicoFormSchema>;