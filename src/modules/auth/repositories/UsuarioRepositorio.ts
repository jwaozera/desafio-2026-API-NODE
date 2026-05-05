import { prismaClient } from '../../../shared/database/prismaClient';
import type { Usuario } from '../../../generated/prisma';

interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

export type { Usuario };

export class UsuarioRepositorio {
  async criarUsuario({ nome, email, senha }: CriarUsuarioDTO): Promise<Usuario> {
    const usuario = await prismaClient.usuario.create({
      data: { nome, email, senha },
    });

    return usuario;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await prismaClient.usuario.findUnique({
      where: { email },
    });

    return usuario;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const usuario = await prismaClient.usuario.findUnique({
      where: { id },
    });

    return usuario;
  }
}
