import { z } from 'zod';

export const registrarEsquema = z.object({
  nome: z
    .string({ message: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string({ message: 'Email é obrigatório' }).email('Formato de email inválido'),
  senha: z
    .string({ message: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres'),
});

export const loginEsquema = z.object({
  email: z.string({ message: 'Email é obrigatório' }).email('Formato de email inválido'),
  senha: z.string({ message: 'Senha é obrigatória' }).min(1, 'Senha é obrigatória'),
});

export type RegistrarDTO = z.infer<typeof registrarEsquema>;
export type LoginDTO = z.infer<typeof loginEsquema>;
