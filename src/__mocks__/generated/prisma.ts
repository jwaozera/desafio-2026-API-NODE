// mock do prisma client gerado (usado automaticamente pelos testes)
// quando o jest resolve o import de '../generated/prisma'
export class PrismaClient {
  usuario = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };
}

// re-exporta tipos como interfaces vazias para satisfazer imports de tipo
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  criadoEm: Date;
  atualizadoEm: Date;
}
