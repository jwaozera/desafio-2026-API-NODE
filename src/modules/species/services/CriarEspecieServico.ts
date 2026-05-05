import { EspecieRepositorio, Especie } from '../repositories/EspecieRepositorio';
import { CriarEspecieDTO } from '../schemas/especieEsquema';

export class CriarEspecieServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar(dados: CriarEspecieDTO, usuarioId: string): Promise<Especie> {
    const especie = await this.especieRepositorio.criar({
      ...dados,
      usuarioId,
    });

    return especie;
  }
}
