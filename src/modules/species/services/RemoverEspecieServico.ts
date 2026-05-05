import { AppErro } from '../../../shared/errors/AppErro';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';

export class RemoverEspecieServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar(id: string): Promise<void> {
    const especieExistente = await this.especieRepositorio.buscarPorId(id);

    if (!especieExistente) {
      throw new AppErro('Espécie não encontrada', 404);
    }

    await this.especieRepositorio.remover(id);
  }
}
