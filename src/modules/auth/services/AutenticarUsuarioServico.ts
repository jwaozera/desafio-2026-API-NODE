import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppErro } from '../../../shared/errors/AppErro';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio';
import { ambiente } from '../../../config/environment';
import { LoginDTO } from '../schemas/autenticacaoEsquema';

interface RespostaAutenticacao {
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  token: string;
}

export class AutenticarUsuarioServico {
  constructor(private usuarioRepositorio: UsuarioRepositorio) {}

  async executar({ email, senha }: LoginDTO): Promise<RespostaAutenticacao> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);

    if (!usuario) {
      // mensagem genérica para não revelar se o email existe
      throw new AppErro('Email ou senha incorretos', 401);
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      throw new AppErro('Email ou senha incorretos', 401);
    }

    const token = jwt.sign({ sub: usuario.id }, ambiente.JWT_SECRETO, {
      expiresIn: ambiente.JWT_EXPIRACAO as jwt.SignOptions['expiresIn'],
    });

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    };
  }
}
