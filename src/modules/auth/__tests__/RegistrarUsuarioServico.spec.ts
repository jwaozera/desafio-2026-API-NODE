import bcrypt from 'bcrypt';
import { RegistrarUsuarioServico } from '../services/RegistrarUsuarioServico';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio';
import { AppErro } from '../../../shared/errors/AppErro';

// mock do repositorio (testes unitários não tocam no banco)
jest.mock('../repositories/UsuarioRepositorio');

describe('RegistrarUsuarioServico', () => {
  let servico: RegistrarUsuarioServico;
  let repositorioMock: jest.Mocked<UsuarioRepositorio>;

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorio() as jest.Mocked<UsuarioRepositorio>;
    servico = new RegistrarUsuarioServico(repositorioMock);
  });

  const dadosRegistro = {
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: 'senha123',
  };

  it('deve registrar um novo usuario com sucesso', async () => {
    repositorioMock.buscarPorEmail.mockResolvedValue(null);
    repositorioMock.criarUsuario.mockResolvedValue({
      id: 'uuid-gerado',
      nome: dadosRegistro.nome,
      email: dadosRegistro.email,
      senha: 'hash-da-senha',
      criadoEm: new Date('2026-01-01'),
      atualizadoEm: new Date('2026-01-01'),
    });

    const resultado = await servico.executar(dadosRegistro);

    expect(resultado).toEqual({
      id: 'uuid-gerado',
      nome: 'João Silva',
      email: 'joao@email.com',
      criadoEm: new Date('2026-01-01'),
    });
    // nunca deve retornar a senha
    expect(resultado).not.toHaveProperty('senha');
  });

  it('deve fazer hash da senha antes de salvar', async () => {
    repositorioMock.buscarPorEmail.mockResolvedValue(null);
    repositorioMock.criarUsuario.mockResolvedValue({
      id: 'uuid-gerado',
      nome: dadosRegistro.nome,
      email: dadosRegistro.email,
      senha: 'hash-da-senha',
      criadoEm: new Date('2026-01-01'),
      atualizadoEm: new Date('2026-01-01'),
    });

    await servico.executar(dadosRegistro);

    const senhaUsada = repositorioMock.criarUsuario.mock.calls[0][0].senha;
    // a senha salva não pode ser a senha em texto puro
    expect(senhaUsada).not.toBe(dadosRegistro.senha);
    // deve ser um hash bcrypt valido
    const hashValido = await bcrypt.compare(dadosRegistro.senha, senhaUsada);
    expect(hashValido).toBe(true);
  });

  it('deve lançar erro 409 se email já estiver em uso', async () => {
    repositorioMock.buscarPorEmail.mockResolvedValue({
      id: 'id-existente',
      nome: 'Outro Usuario',
      email: dadosRegistro.email,
      senha: 'hash',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });

    await expect(servico.executar(dadosRegistro)).rejects.toThrow(AppErro);
    await expect(servico.executar(dadosRegistro)).rejects.toThrow('Email já está em uso');
  });

  it('não deve chamar criarUsuario se email já existe', async () => {
    repositorioMock.buscarPorEmail.mockResolvedValue({
      id: 'id-existente',
      nome: 'Outro',
      email: dadosRegistro.email,
      senha: 'hash',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });

    await expect(servico.executar(dadosRegistro)).rejects.toThrow();
    expect(repositorioMock.criarUsuario).not.toHaveBeenCalled();
  });
});
