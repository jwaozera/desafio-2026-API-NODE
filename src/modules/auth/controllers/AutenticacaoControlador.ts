import { Request, Response } from 'express';
import { RegistrarUsuarioServico } from '../services/RegistrarUsuarioServico';
import { AutenticarUsuarioServico } from '../services/AutenticarUsuarioServico';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio';
import { registrarEsquema, loginEsquema } from '../schemas/autenticacaoEsquema';

export class AutenticacaoControlador {
  async registrar(req: Request, res: Response): Promise<void> {
    const dadosValidados = registrarEsquema.parse(req.body);

    const usuarioRepositorio = new UsuarioRepositorio();
    const registrarServico = new RegistrarUsuarioServico(usuarioRepositorio);

    const usuario = await registrarServico.executar(dadosValidados);

    res.status(201).json({
      status: 'sucesso',
      dados: usuario,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const dadosValidados = loginEsquema.parse(req.body);

    const usuarioRepositorio = new UsuarioRepositorio();
    const autenticarServico = new AutenticarUsuarioServico(usuarioRepositorio);

    const resultado = await autenticarServico.executar(dadosValidados);

    res.status(200).json({
      status: 'sucesso',
      dados: resultado,
    });
  }
}
