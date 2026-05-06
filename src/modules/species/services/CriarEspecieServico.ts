import { EspecieRepositorio, Especie } from '../repositories/EspecieRepositorio';
import { CriarEspecieDTO } from '../schemas/especieEsquema';
import { ClimaServico } from '../../climate/services/ClimaServico';

export class CriarEspecieServico {
  constructor(
    private especieRepositorio: EspecieRepositorio,
    private climaServico: ClimaServico,
  ) {}

  async executar(dados: CriarEspecieDTO, usuarioId: string): Promise<Especie> {
    // cria a especie primeiro (mesmo que o clima falhe, o registro existe)
    const especie = await this.especieRepositorio.criar({
      ...dados,
      usuarioId,
    });

    // tenta enriquecer com dados climaticos (fallback se falhar)
    const dadosClimaticos = await this.climaServico.consultarClima(dados.latitude, dados.longitude);

    if (dadosClimaticos) {
      const especieComClima = await this.especieRepositorio.atualizarClima(
        especie.id,
        dadosClimaticos,
      );
      return especieComClima;
    }

    return especie;
  }
}
