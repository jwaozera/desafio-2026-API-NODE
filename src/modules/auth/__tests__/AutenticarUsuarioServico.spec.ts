import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AutenticarUsuarioServico } from '../services/AutenticarUsuarioServico';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio';
import { AppErro } from '../../../shared/errors/AppErro';

// mock do repositorio (isolamento total do banco)
jest.mock('../repositories/UsuarioRepositorio');

// mock das variáveis de ambiente para não depender do .env nos testes
jest.mock('../../../config/environment', () => ({
  ambiente: {
    JWT_SECRETO: 'segredo-teste',
    JWT_EXPIRACAO: '1h',
  },
}));

describe('AutenticarUsuarioServico', () => {
  let servico: AutenticarUsuarioServico;
  let repositorioMock: jest.Mocked<UsuarioRepositorio>;

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorio() as jest.Mocked<UsuarioRepositorio>;
    servico = new AutenticarUsuarioServico(repositorioMock);
  });

  const criarUsuarioComHash = async () => {
    const senhaHash = await bcrypt.hash('senha123', 10);
    return {
      id: 'usuario-id-123',
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: senhaHash,
      criadoEm: new Date('2026-01-01'),
      atualizadoEm: new Date('2026-01-01'),
    };
  };

  it('deve autenticar com credenciais válidas e retornar token', async () => {
    const usuario = await criarUsuarioComHash();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuario);

    const resultado = await servico.executar({
      email: 'joao@email.com',
      senha: 'senha123',
    });

    expect(resultado.usuario).toEqual({
      id: 'usuario-id-123',
      nome: 'João Silva',
      email: 'joao@email.com',
    });
    expect(resultado.token).toBeDefined();
    // nunca retorna a senha
    expect(resultado.usuario).not.toHaveProperty('senha');
  });

  it('deve gerar um token JWT válido com sub do usuario', async () => {
    const usuario = await criarUsuarioComHash();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuario);

    const resultado = await servico.executar({
      email: 'joao@email.com',
      senha: 'senha123',
    });

    const payload = jwt.verify(resultado.token, 'segredo-teste') as { sub: string };
    expect(payload.sub).toBe('usuario-id-123');
  });

  it('deve lançar erro 401 quando email não existe', async () => {
    repositorioMock.buscarPorEmail.mockResolvedValue(null);

    await expect(
      servico.executar({ email: 'naoexiste@email.com', senha: 'qualquer' }),
    ).rejects.toThrow(AppErro);
    await expect(
      servico.executar({ email: 'naoexiste@email.com', senha: 'qualquer' }),
    ).rejects.toThrow('Email ou senha incorretos');
  });

  it('deve lançar erro 401 quando senha está incorreta', async () => {
    const usuario = await criarUsuarioComHash();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuario);

    await expect(
      servico.executar({ email: 'joao@email.com', senha: 'senhaerrada' }),
    ).rejects.toThrow(AppErro);
    await expect(
      servico.executar({ email: 'joao@email.com', senha: 'senhaerrada' }),
    ).rejects.toThrow('Email ou senha incorretos');
  });

  it('deve usar mensagem genérica para email e senha errados (segurança)', async () => {
    // email inexistente
    repositorioMock.buscarPorEmail.mockResolvedValue(null);
    try {
      await servico.executar({ email: 'x@x.com', senha: '123' });
    } catch (erro) {
      expect((erro as AppErro).message).toBe('Email ou senha incorretos');
    }

    // senha errada
    const usuario = await criarUsuarioComHash();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuario);
    try {
      await servico.executar({ email: 'joao@email.com', senha: 'errada' });
    } catch (erro) {
      // mesma mensagem (não revela se o email existe)
      expect((erro as AppErro).message).toBe('Email ou senha incorretos');
    }
  });
});
