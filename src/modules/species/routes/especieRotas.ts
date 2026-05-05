import { Router } from 'express';
import { EspecieControlador } from '../controllers/EspecieControlador';
import { garantirAutenticacao } from '../../../shared/middlewares/garantirAutenticacao';

const especieRotas = Router();
const controlador = new EspecieControlador();

// todas as rotas de especie exigem autenticacao
especieRotas.use(garantirAutenticacao);

especieRotas.post('/', (req, res) => controlador.criar(req, res));
especieRotas.get('/estatisticas', (req, res) => controlador.estatisticas(req, res));
especieRotas.get('/', (req, res) => controlador.listar(req, res));
especieRotas.get('/:id', (req, res) => controlador.buscarPorId(req, res));
especieRotas.put('/:id', (req, res) => controlador.atualizar(req, res));
especieRotas.delete('/:id', (req, res) => controlador.remover(req, res));

export { especieRotas };
