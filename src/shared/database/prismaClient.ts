import { PrismaClient } from '../../generated/prisma';

// singleton para evitar multiplas conexões em dev
export const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});
