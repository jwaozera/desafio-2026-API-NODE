import { CriarEspecieServico } from '../services/CriarEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { ClimaServico } from '../../climate/services/ClimaServico';

// mock do repositorio (isolamento total do banco)
jest.mock('../repositories/EspecieRepositorio');
jest.mock('../../climate/services/ClimaServico');

describe('CriarEspecieServico', () => {
  let servico: CriarEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;
  let climaServicoMock: jest.Mocked<ClimaServico>;

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    climaServicoMock = new ClimaServico() as jest.Mocked<ClimaServico>;
    servico = new CriarEspecieServico(repositorioMock, climaServicoMock);
  });

  const dadosEspecie = {
    nomeComum: 'Arara-azul',
    nomeCientifico: 'Anodorhynchus hyacinthinus',
    categoria: 'ave' as const,
    latitude: -15.78,
    longitude: -47.93,
  };

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

  it('deve criar especie e enriquecer com dados climaticos', async () => {
    const dadosClima = {
      temperaturaAtual: 22.3,
      umidadeAtual: 65,
      descricaoClima: 'Nublado',
      climaAtualizadoEm: new Date('2026-01-01T12:00:00'),
    };

    repositorioMock.criar.mockResolvedValue(especieCriada);
    climaServicoMock.consultarClima.mockResolvedValue(dadosClima);
    repositorioMock.atualizarClima.mockResolvedValue({
      ...especieCriada,
      ...dadosClima,
    });

    const resultado = await servico.executar(dadosEspecie, 'usuario-id-123');

    expect(resultado.temperaturaAtual).toBe(22.3);
    expect(resultado.descricaoClima).toBe('Nublado');
    expect(climaServicoMock.consultarClima).toHaveBeenCalledWith(-15.78, -47.93);
  });

  it('deve criar especie sem clima quando api falha (graceful degradation)', async () => {
    repositorioMock.criar.mockResolvedValue(especieCriada);
    climaServicoMock.consultarClima.mockResolvedValue(null);

    const resultado = await servico.executar(dadosEspecie, 'usuario-id-123');

    expect(resultado).toEqual(especieCriada);
    expect(resultado.temperaturaAtual).toBeNull();
    expect(repositorioMock.atualizarClima).not.toHaveBeenCalled();
  });

  it('deve associar o usuarioId do token a especie', async () => {
    repositorioMock.criar.mockResolvedValue(especieCriada);
    climaServicoMock.consultarClima.mockResolvedValue(null);

    await servico.executar(dadosEspecie, 'meu-usuario');

    const chamada = repositorioMock.criar.mock.calls[0][0];
    expect(chamada.usuarioId).toBe('meu-usuario');
  });
});
