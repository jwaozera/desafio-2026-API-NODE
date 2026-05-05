import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { ListarEspeciesDTO } from '../schemas/especieEsquema';

export class ListarEspeciesServico {
  constructor(private especieRepositorio: EspecieRepositorio) {}

  async executar({ categoria, nome, pagina, limite }: ListarEspeciesDTO) {
    const resultado = await this.especieRepositorio.listar({
      categoria,
      nome,
      pagina,
      limite,
    });

    return resultado;
  }
}
