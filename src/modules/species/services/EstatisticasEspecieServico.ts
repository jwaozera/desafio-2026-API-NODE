import { EspecieRepositorio } from '../repositories/EspecieRepositorio';

export class EstatisticasEspecieServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar() {
    const estatisticas = await this.especieRepositorio.estatisticasPorCategoria();

    return estatisticas;
  }
}
