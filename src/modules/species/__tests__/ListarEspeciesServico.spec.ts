import { ListarEspeciesServico } from '../services/ListarEspeciesServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';

jest.mock('../repositories/EspecieRepositorio');

describe('ListarEspeciesServico', () => {
  let servico: ListarEspeciesServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    servico = new ListarEspeciesServico(repositorioMock);
  });

  it('deve listar especies com paginacao padrao', async () => {
    const resultadoEsperado = {
      especies: [],
      total: 0,
      pagina: 1,
      limite: 20,
      totalPaginas: 0,
    };

    repositorioMock.listar.mockResolvedValue(resultadoEsperado);

    const resultado = await servico.executar({ pagina: 1, limite: 20 });

    expect(resultado).toEqual(resultadoEsperado);
    expect(repositorioMock.listar).toHaveBeenCalledWith({
      categoria: undefined,
      nome: undefined,
      pagina: 1,
      limite: 20,
    });
  });

  it('deve passar filtro de categoria para o repositorio', async () => {
    repositorioMock.listar.mockResolvedValue({
      especies: [],
      total: 0,
      pagina: 1,
      limite: 20,
      totalPaginas: 0,
    });

    await servico.executar({ categoria: 'ave', pagina: 1, limite: 20 });

    expect(repositorioMock.listar).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'ave' }),
    );
  });

  it('deve passar filtro de nome para o repositorio', async () => {
    repositorioMock.listar.mockResolvedValue({
      especies: [],
      total: 0,
      pagina: 1,
      limite: 20,
      totalPaginas: 0,
    });

    await servico.executar({ nome: 'arara', pagina: 1, limite: 10 });

    expect(repositorioMock.listar).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'arara', limite: 10 }),
    );
  });
});
