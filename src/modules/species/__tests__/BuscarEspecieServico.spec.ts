import { BuscarEspecieServico } from '../services/BuscarEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { AppErro } from '../../../shared/errors/AppErro';

jest.mock('../repositories/EspecieRepositorio');

describe('BuscarEspecieServico', () => {
  let servico: BuscarEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;

  const especieMock = {
    id: 'especie-uuid',
    nomeComum: 'Arara-azul',
    nomeCientifico: 'Anodorhynchus hyacinthinus',
    categoria: 'ave',
    latitude: -15.78,
    longitude: -47.93,
    dataRegistro: new Date('2026-01-01'),
    usuarioId: 'usuario-id',
    temperaturaAtual: null,
    umidadeAtual: null,
    descricaoClima: null,
    climaAtualizadoEm: null,
    criadoEm: new Date('2026-01-01'),
    atualizadoEm: new Date('2026-01-01'),
  };

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    servico = new BuscarEspecieServico(repositorioMock);
  });

  it('deve retornar especie quando encontrada', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieMock);

    const resultado = await servico.executar('especie-uuid');

    expect(resultado).toEqual(especieMock);
  });

  it('deve lancar erro 404 quando especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('id-inexistente')).rejects.toThrow(AppErro);
    await expect(servico.executar('id-inexistente')).rejects.toThrow('Espécie não encontrada');
  });
});
