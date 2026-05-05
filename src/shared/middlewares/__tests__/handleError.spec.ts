import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppErro } from '../../errors/AppErro';
import { handleError } from '../handleError';

// factory de mocks para evitar repetição
function criarMockResponse(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const mockRequest = {} as Request;
const mockNext = jest.fn() as NextFunction;

describe('handleError', () => {
  it('deve tratar AppErro com código http correto', () => {
    const erro = new AppErro('Usuário não encontrado', 404);
    const res = criarMockResponse();

    handleError(erro, mockRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'erro',
      mensagem: 'Usuário não encontrado',
    });
  });

  it('deve tratar ZodError com código 422 e detalhes dos campos', () => {
    // simula um erro de validação real do zod v4
    const esquemaTeste = z.object({
      email: z.string().min(1, 'Campo obrigatório'),
    });
    const resultado = esquemaTeste.safeParse({ email: '' });

    // garantia de que o parse falhou para obter o erro real
    if (resultado.success) throw new Error('deveria ter falhado');

    const res = criarMockResponse();
    handleError(resultado.error as unknown as Error, mockRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'erro',
        mensagem: 'Dados de entrada inválidos',
        erros: expect.arrayContaining([
          expect.objectContaining({
            campo: 'email',
          }),
        ]),
      }),
    );
  });

  it('deve tratar erros desconhecidos como 500 sem expor detalhes', () => {
    const erroInterno = new Error('segredo que não deve vazar');
    const res = criarMockResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    handleError(erroInterno, mockRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'erro',
      mensagem: 'Erro interno do servidor',
    });
    // garante que o erro é logado internamente para debug
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
