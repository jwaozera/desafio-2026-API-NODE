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

  especie = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  };
}

// re-exporta tipos como interfaces para satisfazer imports de tipo
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Especie {
  id: string;
  nomeComum: string;
  nomeCientifico: string;
  categoria: string;
  latitude: number;
  longitude: number;
  dataRegistro: Date;
  usuarioId: string;
  temperaturaAtual: number | null;
  umidadeAtual: number | null;
  descricaoClima: string | null;
  climaAtualizadoEm: Date | null;
  criadoEm: Date;
  atualizadoEm: Date;
}
