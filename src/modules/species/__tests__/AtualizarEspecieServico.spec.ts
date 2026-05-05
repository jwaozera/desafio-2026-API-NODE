import { AtualizarEspecieServico } from '../services/AtualizarEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { AppErro } from '../../../shared/errors/AppErro';

jest.mock('../repositories/EspecieRepositorio');

describe('AtualizarEspecieServico', () => {
  let servico: AtualizarEspecieServico;
  let repositorioMock: jest.Mocked<EspecieRepositorio>;

  const especieExistente = {
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
    servico = new AtualizarEspecieServico(repositorioMock);
  });

  it('deve atualizar especie existente', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieExistente);
    repositorioMock.atualizar.mockResolvedValue({
      ...especieExistente,
      nomeComum: 'Arara-azul-grande',
    });

    const resultado = await servico.executar('especie-uuid', {
      nomeComum: 'Arara-azul-grande',
    });

    expect(resultado.nomeComum).toBe('Arara-azul-grande');
    expect(repositorioMock.atualizar).toHaveBeenCalledWith('especie-uuid', {
      nomeComum: 'Arara-azul-grande',
    });
  });

  it('deve lancar erro 404 se especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('id-inexistente', { nomeComum: 'Novo nome' })).rejects.toThrow(
      AppErro,
    );
    await expect(servico.executar('id-inexistente', { nomeComum: 'Novo nome' })).rejects.toThrow(
      'Espécie não encontrada',
    );
  });

  it('nao deve chamar atualizar se especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('x', { nomeComum: 'X' })).rejects.toThrow();
    expect(repositorioMock.atualizar).not.toHaveBeenCalled();
  });
});
