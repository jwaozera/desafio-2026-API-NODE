import { AtualizarClimaEspecieServico } from '../services/AtualizarClimaEspecieServico';
import { EspecieRepositorio } from '../../species/repositories/EspecieRepositorio';
import { ClimaServico } from '../services/ClimaServico';
import { AppErro } from '../../../shared/errors/AppErro';

jest.mock('../../species/repositories/EspecieRepositorio');
jest.mock('../services/ClimaServico');

describe('AtualizarClimaEspecieServico', () => {
  let servico: AtualizarClimaEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;
  let climaServicoMock: jest.Mocked<ClimaServico>;

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

  const dadosClimaticos = {
    temperaturaAtual: 22.3,
    umidadeAtual: 65,
    descricaoClima: 'Nublado',
    climaAtualizadoEm: new Date('2026-01-01T12:00:00'),
  };

  beforeEach(() => {
    repositorioMock = new EspecieRepositorio() as jest.Mocked<EspecieRepositorio>;
    climaServicoMock = new ClimaServico() as jest.Mocked<ClimaServico>;
    servico = new AtualizarClimaEspecieServico(repositorioMock, climaServicoMock);
  });

  it('deve atualizar clima de especie existente', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieMock);
    climaServicoMock.consultarClima.mockResolvedValue(dadosClimaticos);
    repositorioMock.atualizarClima.mockResolvedValue({
      ...especieMock,
      ...dadosClimaticos,
    });

    const resultado = await servico.executar('especie-uuid');

    expect(resultado.temperaturaAtual).toBe(22.3);
    expect(resultado.descricaoClima).toBe('Nublado');
    expect(climaServicoMock.consultarClima).toHaveBeenCalledWith(-15.78, -47.93);
  });

  it('deve lancar erro 404 quando especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('id-inexistente')).rejects.toThrow(AppErro);
    await expect(servico.executar('id-inexistente')).rejects.toThrow('Espécie não encontrada');
  });

  it('deve lancar erro 503 quando api de clima falha', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieMock);
    climaServicoMock.consultarClima.mockResolvedValue(null);

    await expect(servico.executar('especie-uuid')).rejects.toThrow(AppErro);
    await expect(servico.executar('especie-uuid')).rejects.toThrow(
      'Não foi possível obter dados climáticos no momento',
    );
  });

  it('nao deve chamar atualizarClima quando api de clima falha', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieMock);
    climaServicoMock.consultarClima.mockResolvedValue(null);

    await expect(servico.executar('especie-uuid')).rejects.toThrow();
    expect(repositorioMock.atualizarClima).not.toHaveBeenCalled();
  });
});
