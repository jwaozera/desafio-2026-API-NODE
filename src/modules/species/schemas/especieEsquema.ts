import { z } from 'zod';

const categoriasValidas = [
  'ave',
  'peixe',
  'mamifero',
  'reptil',
  'anfibio',
  'planta',
  'inseto',
  'outro',
] as const;

export const criarEspecieEsquema = z.object({
  nomeComum: z
    .string({ message: 'Nome comum é obrigatório' })
    .min(2, 'Nome comum deve ter pelo menos 2 caracteres')
    .max(200, 'Nome comum deve ter no máximo 200 caracteres'),
  nomeCientifico: z
    .string({ message: 'Nome científico é obrigatório' })
    .min(2, 'Nome científico deve ter pelo menos 2 caracteres')
    .max(200, 'Nome científico deve ter no máximo 200 caracteres'),
  categoria: z.enum(categoriasValidas, {
    message: `Categoria deve ser uma das: ${categoriasValidas.join(', ')}`,
  }),
  latitude: z
    .number({ message: 'Latitude é obrigatória' })
    .min(-90, 'Latitude deve ser entre -90 e 90')
    .max(90, 'Latitude deve ser entre -90 e 90'),
  longitude: z
    .number({ message: 'Longitude é obrigatória' })
    .min(-180, 'Longitude deve ser entre -180 e 180')
    .max(180, 'Longitude deve ser entre -180 e 180'),
});

export const atualizarEspecieEsquema = z
  .object({
    nomeComum: z
      .string()
      .min(2, 'Nome comum deve ter pelo menos 2 caracteres')
      .max(200, 'Nome comum deve ter no máximo 200 caracteres')
      .optional(),
    nomeCientifico: z
      .string()
      .min(2, 'Nome científico deve ter pelo menos 2 caracteres')
      .max(200, 'Nome científico deve ter no máximo 200 caracteres')
      .optional(),
    categoria: z
      .enum(categoriasValidas, {
        message: `Categoria deve ser uma das: ${categoriasValidas.join(', ')}`,
      })
      .optional(),
    latitude: z
      .number()
      .min(-90, 'Latitude deve ser entre -90 e 90')
      .max(90, 'Latitude deve ser entre -90 e 90')
      .optional(),
    longitude: z
      .number()
      .min(-180, 'Longitude deve ser entre -180 e 180')
      .max(180, 'Longitude deve ser entre -180 e 180')
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização',
  });

export const listarEspeciesEsquema = z.object({
  categoria: z.enum(categoriasValidas).optional(),
  nome: z.string().optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamEsquema = z.object({
  id: z.string({ message: 'ID é obrigatório' }).uuid('ID deve ser um UUID válido'),
});

export type CriarEspecieDTO = z.infer<typeof criarEspecieEsquema>;
export type AtualizarEspecieDTO = z.infer<typeof atualizarEspecieEsquema>;
export type ListarEspeciesDTO = z.infer<typeof listarEspeciesEsquema>;
