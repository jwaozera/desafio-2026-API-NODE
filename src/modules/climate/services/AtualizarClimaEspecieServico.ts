import { AppErro } from '../../../shared/errors/AppErro';
import { EspecieRepositorio, Especie } from '../../species/repositories/EspecieRepositorio';
import { ClimaServico } from './ClimaServico';

export class AtualizarClimaEspecieServico {
  constructor(
    private especieRepositorio: EspecieRepositorio,
    private climaServico: ClimaServico,
  ) {}

  async executar(especieId: string): Promise<Especie> {
    const especie = await this.especieRepositorio.buscarPorId(especieId);

    if (!especie) {
      throw new AppErro('Espécie não encontrada', 404);
    }

    const dadosClimaticos = await this.climaServico.consultarClima(
      especie.latitude,
      especie.longitude,
    );

    if (!dadosClimaticos) {
      throw new AppErro('Não foi possível obter dados climáticos no momento', 503);
    }

    const especieAtualizada = await this.especieRepositorio.atualizarClima(
      especie.id,
      dadosClimaticos,
    );

    return especieAtualizada;
  }
}
