import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppErro } from '../errors/AppErro';
import { ambiente } from '../../config/environment';

// estende a interface do express para incluir o id do usuario autenticado
export interface RequestAutenticado extends Request {
  usuarioId?: string;
}

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function garantirAutenticacao(
  req: RequestAutenticado,
  _res: Response,
  next: NextFunction,
): void {
  const cabecalhoAutorizacao = req.headers.authorization;

  if (!cabecalhoAutorizacao) {
    throw new AppErro('Token não fornecido', 401);
  }

  // formato esperado: "Bearer <token>"
  const partes = cabecalhoAutorizacao.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    throw new AppErro('Formato de token inválido', 401);
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, ambiente.JWT_SECRETO) as TokenPayload;

    // injeta o id do usuario na request para uso nas camadas seguintes
    req.usuarioId = payload.sub;

    next();
  } catch {
    throw new AppErro('Token inválido ou expirado', 401);
  }
}
