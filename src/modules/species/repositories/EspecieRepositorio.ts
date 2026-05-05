import { prismaClient } from '../../../shared/database/prismaClient';
import type { Especie } from '../../../generated/prisma';

export type { Especie };

interface CriarEspecieDTO {
  nomeComum: string;
  nomeCientifico: string;
  categoria: string;
  latitude: number;
  longitude: number;
  usuarioId: string;
}

interface AtualizarEspecieDTO {
  nomeComum?: string;
  nomeCientifico?: string;
  categoria?: string;
  latitude?: number;
  longitude?: number;
}

interface FiltrosListagem {
  categoria?: string;
  nome?: string;
  pagina: number;
  limite: number;
}

interface ResultadoPaginado {
  especies: Especie[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

interface EstatisticaCategoria {
  categoria: string;
  quantidade: number;
}

export class EspecieRepositorio {
  async criar(dados: CriarEspecieDTO): Promise<Especie> {
    const especie = await prismaClient.especie.create({
      data: dados,
    });

    return especie;
  }

  async buscarPorId(id: string): Promise<Especie | null> {
    const especie = await prismaClient.especie.findUnique({
      where: { id },
    });

    return especie;
  }

  async listar({ categoria, nome, pagina, limite }: FiltrosListagem): Promise<ResultadoPaginado> {
    // monta filtros dinamicamente com AND
    const where: Record<string, unknown> = {};

    if (categoria) {
      where.categoria = categoria;
    }

    if (nome) {
      where.OR = [
        { nomeComum: { contains: nome, mode: 'insensitive' } },
        { nomeCientifico: { contains: nome, mode: 'insensitive' } },
      ];
    }

    const [especies, total] = await Promise.all([
      prismaClient.especie.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { criadoEm: 'desc' },
      }),
      prismaClient.especie.count({ where }),
    ]);

    return {
      especies,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async atualizar(id: string, dados: AtualizarEspecieDTO): Promise<Especie> {
    const especie = await prismaClient.especie.update({
      where: { id },
      data: dados,
    });

    return especie;
  }

  async remover(id: string): Promise<void> {
    await prismaClient.especie.delete({
      where: { id },
    });
  }

  async estatisticasPorCategoria(): Promise<EstatisticaCategoria[]> {
    const resultado = await prismaClient.especie.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
      orderBy: { _count: { categoria: 'desc' } },
    });

    return resultado.map((item) => ({
      categoria: item.categoria,
      quantidade: item._count.categoria,
    }));
  }
}
