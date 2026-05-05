import { AppErro } from '../../../shared/errors/AppErro';
import { EspecieRepositorio, Especie } from '../repositories/EspecieRepositorio';

export class BuscarEspecieServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar(id: string): Promise<Especie> {
    const especie = await this.especieRepositorio.buscarPorId(id);

    if (!especie) {
      throw new AppErro('Espécie não encontrada', 404);
    }

    return especie;
  }
}
