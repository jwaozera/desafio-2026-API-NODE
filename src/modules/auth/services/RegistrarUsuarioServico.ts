import bcrypt from 'bcrypt';
import { AppErro } from '../../../shared/errors/AppErro';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio';
import { RegistrarDTO } from '../schemas/autenticacaoEsquema';

// resposta sem senha - nunca expor hash ao cliente -
interface UsuarioSemSenha {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
}

export class RegistrarUsuarioServico {
  constructor(private usuarioRepositorio: UsuarioRepositorio) {}

  async executar({ nome, email, senha }: RegistrarDTO): Promise<UsuarioSemSenha> {
    const usuarioExistente = await this.usuarioRepositorio.buscarPorEmail(email);

    if (usuarioExistente) {
      throw new AppErro('Email já está em uso', 409);
    }

    // salt rounds = 10 pra ter balanço entre segurança e performance
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await this.usuarioRepositorio.criarUsuario({
      nome,
      email,
      senha: senhaHash,
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criadoEm: usuario.criadoEm,
    };
  }
}
