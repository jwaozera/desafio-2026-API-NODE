import { Response } from 'express';
import { RequestAutenticado } from '../../../shared/middlewares/garantirAutenticacao';
import { EspecieRepositorio } from '../repositories/EspecieRepositorio';
import { CriarEspecieServico } from '../services/CriarEspecieServico';
import { ListarEspeciesServico } from '../services/ListarEspeciesServico';
import { BuscarEspecieServico } from '../services/BuscarEspecieServico';
import { AtualizarEspecieServico } from '../services/AtualizarEspecieServico';
import { RemoverEspecieServico } from '../services/RemoverEspecieServico';
import { EstatisticasEspecieServico } from '../services/EstatisticasEspecieServico';
import { ClimaServico } from '../../climate/services/ClimaServico';
import { AtualizarClimaEspecieServico } from '../../climate/services/AtualizarClimaEspecieServico';
import {
  criarEspecieEsquema,
  atualizarEspecieEsquema,
  listarEspeciesEsquema,
} from '../schemas/especieEsquema';
import { AppErro } from '../../../shared/errors/AppErro';

export class EspecieControlador {
  async criar(req: RequestAutenticado, res: Response): Promise<void> {
    const dadosValidados = criarEspecieEsquema.parse(req.body);

    if (!req.usuarioId) {
      throw new AppErro('Usuário não autenticado', 401);
    }

    const repositorio = new EspecieRepositorio();
    const climaServico = new ClimaServico();
    const servico = new CriarEspecieServico(repositorio, climaServico);

    const especie = await servico.executar(dadosValidados, req.usuarioId);

    res.status(201).json({
      status: 'sucesso',
      dados: especie,
    });
  }

  async listar(req: RequestAutenticado, res: Response): Promise<void> {
    const filtros = listarEspeciesEsquema.parse(req.query);

    const repositorio = new EspecieRepositorio();
    const servico = new ListarEspeciesServico(repositorio);

    const resultado = await servico.executar(filtros);

    res.status(200).json({
      status: 'sucesso',
      dados: resultado,
    });
  }

  async buscarPorId(req: RequestAutenticado, res: Response): Promise<void> {
    const { id } = req.params;

    const repositorio = new EspecieRepositorio();
    const servico = new BuscarEspecieServico(repositorio);

    const especie = await servico.executar(id);

    res.status(200).json({
      status: 'sucesso',
      dados: especie,
    });
  }

  async atualizar(req: RequestAutenticado, res: Response): Promise<void> {
    const { id } = req.params;
    const dadosValidados = atualizarEspecieEsquema.parse(req.body);

    const repositorio = new EspecieRepositorio();
    const servico = new AtualizarEspecieServico(repositorio);

    const especie = await servico.executar(id, dadosValidados);

    res.status(200).json({
      status: 'sucesso',
      dados: especie,
    });
  }

  async remover(req: RequestAutenticado, res: Response): Promise<void> {
    const { id } = req.params;

    const repositorio = new EspecieRepositorio();
    const servico = new RemoverEspecieServico(repositorio);

    await servico.executar(id);

    res.status(204).send();
  }

  async estatisticas(_req: RequestAutenticado, res: Response): Promise<void> {
    const repositorio = new EspecieRepositorio();
    const servico = new EstatisticasEspecieServico(repositorio);

    const estatisticas = await servico.executar();

    res.status(200).json({
      status: 'sucesso',
      dados: estatisticas,
    });
  }

  async consultarClima(req: RequestAutenticado, res: Response): Promise<void> {
    const { id } = req.params;

    const repositorio = new EspecieRepositorio();
    const climaServico = new ClimaServico();
    const servico = new AtualizarClimaEspecieServico(repositorio, climaServico);

    const especie = await servico.executar(id);

    res.status(200).json({
      status: 'sucesso',
      dados: {
        id: especie.id,
        nomeComum: especie.nomeComum,
        temperaturaAtual: especie.temperaturaAtual,
        umidadeAtual: especie.umidadeAtual,
        descricaoClima: especie.descricaoClima,
        climaAtualizadoEm: especie.climaAtualizadoEm,
      },
    });
  }
}
