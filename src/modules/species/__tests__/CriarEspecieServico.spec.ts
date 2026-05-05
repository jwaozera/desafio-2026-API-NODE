import { CriarEspecieServico } from '../services/CriarEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';

// mock do repositorio (isolamento total do banco)
jest.mock('../repositories/EspecieRepositorio');

describe('CriarEspecieServico', () => {
  let servico: CriarEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    servico = new CriarEspecieServico(repositorioMock);
  });

  const dadosEspecie = {
    nomeComum: 'Arara-azul',
    nomeCientifico: 'Anodorhynchus hyacinthinus',
    categoria: 'ave' as const,
    latitude: -15.78,
    longitude: -47.93,
  };

  it('deve criar uma especie com sucesso', async () => {
    const especieCriada = {
      id: 'especie-uuid',
      ...dadosEspecie,
      dataRegistro: new Date('2026-01-01'),
      usuarioId: 'usuario-id-123',
      temperaturaAtual: null,
      umidadeAtual: null,
      descricaoClima: null,
      climaAtualizadoEm: null,
      criadoEm: new Date('2026-01-01'),
      atualizadoEm: new Date('2026-01-01'),
    };

    repositorioMock.criar.mockResolvedValue(especieCriada);

    const resultado = await servico.executar(dadosEspecie, 'usuario-id-123');

    expect(resultado).toEqual(especieCriada);
    expect(repositorioMock.criar).toHaveBeenCalledWith({
      ...dadosEspecie,
      usuarioId: 'usuario-id-123',
    });
  });

  it('deve associar o usuarioId do token a especie', async () => {
    repositorioMock.criar.mockResolvedValue({
      id: 'especie-uuid',
      ...dadosEspecie,
      dataRegistro: new Date(),
      usuarioId: 'meu-usuario',
      temperaturaAtual: null,
      umidadeAtual: null,
      descricaoClima: null,
      climaAtualizadoEm: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });

    await servico.executar(dadosEspecie, 'meu-usuario');

    const chamada = repositorioMock.criar.mock.calls[0][0];
    expect(chamada.usuarioId).toBe('meu-usuario');
  });
});
