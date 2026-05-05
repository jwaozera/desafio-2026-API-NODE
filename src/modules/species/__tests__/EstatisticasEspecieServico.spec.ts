import { EstatisticasEspecieServico } from '../services/EstatisticasEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';

jest.mock('../repositories/EspecieRepositorio');

describe('EstatisticasEspecieServico', () => {
  let servico: EstatisticasEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    servico = new EstatisticasEspecieServico(repositorioMock);
  });

  it('deve retornar estatisticas por categoria', async () => {
    const estatisticasMock = [
      { categoria: 'ave', quantidade: 15 },
      { categoria: 'peixe', quantidade: 8 },
      { categoria: 'mamifero', quantidade: 5 },
    ];

    repositorioMock.estatisticasPorCategoria.mockResolvedValue(estatisticasMock);

    const resultado = await servico.executar();

    expect(resultado).toEqual(estatisticasMock);
    expect(resultado).toHaveLength(3);
  });

  it('deve retornar lista vazia quando nao ha especies', async () => {
    repositorioMock.estatisticasPorCategoria.mockResolvedValue([]);

    const resultado = await servico.executar();

    expect(resultado).toEqual([]);
  });
});
