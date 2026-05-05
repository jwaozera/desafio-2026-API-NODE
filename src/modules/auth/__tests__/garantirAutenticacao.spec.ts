import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  garantirAutenticacao,
  RequestAutenticado,
} from '../../../shared/middlewares/garantirAutenticacao';
import { AppErro } from '../../../shared/errors/AppErro';

// mock do ambiente para não depender do .env
jest.mock('../../../config/environment', () => ({
  ambiente: {
    JWT_SECRETO: 'segredo-teste',
  },
}));

describe('garantirAutenticacao', () => {
  let mockReq: Partial<RequestAutenticado>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('deve lançar erro se token não for fornecido', () => {
    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow(AppErro);
    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Token não fornecido');
  });

  it('deve lançar erro se formato do token for inválido', () => {
    mockReq.headers = { authorization: 'InvalidFormat token123' };

    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Formato de token inválido');
  });

  it('deve lançar erro se authorization não tiver duas partes', () => {
    mockReq.headers = { authorization: 'BearerToken' };

    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Formato de token inválido');
  });

  it('deve lançar erro se token for inválido', () => {
    mockReq.headers = { authorization: 'Bearer token-invalido' };

    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Token inválido ou expirado');
  });

  it('deve chamar next e injetar usuarioId com token válido', () => {
    const token = jwt.sign({ sub: 'usuario-123' }, 'segredo-teste', {
      expiresIn: '1h',
    });
    mockReq.headers = { authorization: `Bearer ${token}` };

    garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.usuarioId).toBe('usuario-123');
  });

  it('deve lançar erro com token expirado', () => {
    // token que já expirou (expiresIn negativo)
    const token = jwt.sign({ sub: 'usuario-123' }, 'segredo-teste', {
      expiresIn: '-1s',
    });
    mockReq.headers = { authorization: `Bearer ${token}` };

    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Token inválido ou expirado');
  });

  it('deve lançar erro com token assinado com segredo diferente', () => {
    const token = jwt.sign({ sub: 'usuario-123' }, 'outro-segredo', {
      expiresIn: '1h',
    });
    mockReq.headers = { authorization: `Bearer ${token}` };

    expect(() => {
      garantirAutenticacao(mockReq as RequestAutenticado, mockRes as Response, mockNext);
    }).toThrow('Token inválido ou expirado');
  });
});
