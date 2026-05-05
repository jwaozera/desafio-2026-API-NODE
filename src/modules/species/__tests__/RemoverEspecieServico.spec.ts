import { RemoverEspecieServico } from '../services/RemoverEspecieServico';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { AppErro } from '../../../shared/errors/AppErro';

jest.mock('../repositories/EspecieRepositorio');

describe('RemoverEspecieServico', () => {
  let servico: RemoverEspecieServico;
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
    servico = new RemoverEspecieServico(repositorioMock);
  });

  it('deve remover especie existente', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(especieExistente);
    repositorioMock.remover.mockResolvedValue();

    await servico.executar('especie-uuid');

    expect(repositorioMock.remover).toHaveBeenCalledWith('especie-uuid');
  });

  it('deve lancar erro 404 se especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('id-inexistente')).rejects.toThrow(AppErro);
    await expect(servico.executar('id-inexistente')).rejects.toThrow('Espécie não encontrada');
  });

  it('nao deve chamar remover se especie nao existe', async () => {
    repositorioMock.buscarPorId.mockResolvedValue(null);

    await expect(servico.executar('x')).rejects.toThrow();
    expect(repositorioMock.remover).not.toHaveBeenCalled();
  });
});
