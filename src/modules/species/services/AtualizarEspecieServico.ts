import { AppErro } from '../../../shared/errors/AppErro';
import { EspecieRepositorio, Especie } from '../repositories/EspecieRepositorio';
import { AtualizarEspecieDTO } from '../schemas/especieEsquema';

export class AtualizarEspecieServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar(id: string, dados: AtualizarEspecieDTO): Promise<Especie> {
    const especieExistente = await this.especieRepositorio.buscarPorId(id);

    if (!especieExistente) {
      throw new AppErro('Espécie não encontrada', 404);
    }

    const especieAtualizada = await this.especieRepositorio.atualizar(id, dados);

    return especieAtualizada;
  }
}
