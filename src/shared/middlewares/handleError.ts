import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppErro } from '../errors/AppErro';

// centraliza o tratamento de todos os erros da aplicação
export function handleError(erro: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (erro instanceof AppErro) {
    res.status(erro.codigoHttp).json({
      status: 'erro',
      mensagem: erro.message,
    });
    return;
  }

  // zod v4: ZodError não estende Error, então checamos via instanceof z.ZodError
  if (erro instanceof z.ZodError) {
    res.status(422).json({
      status: 'erro',
      mensagem: 'Dados de entrada inválidos',
      erros: erro.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    });
    return;
  }

  // qualquer erro não esperado log interno, resposta genérica pro cliente
  console.error('erro interno não tratado:', erro);
  res.status(500).json({
    status: 'erro',
    mensagem: 'Erro interno do servidor',
  });
}
