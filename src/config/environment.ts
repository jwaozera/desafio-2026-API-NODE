import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// esquema de validação garante que a app falha rápido se faltar variável crítica
const esquemaAmbiente = z.object({
  PORTA: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRETO: z.string().min(1, 'JWT_SECRETO é obrigatório'),
  JWT_EXPIRACAO: z.string().default('24h'),
});

const resultadoValidacao = esquemaAmbiente.safeParse(process.env);

if (!resultadoValidacao.success) {
  console.error(' variáveis de ambiente inválidas:', resultadoValidacao.error.format());
  process.exit(1);
}

export const ambiente = resultadoValidacao.data;
