import { Router } from 'express';
import { AutenticacaoControlador } from '../controllers/AutenticacaoControlador';

const autenticacaoRotas = Router();
const controlador = new AutenticacaoControlador();

autenticacaoRotas.post('/registrar', (req, res) => controlador.registrar(req, res));
autenticacaoRotas.post('/login', (req, res) => controlador.login(req, res));

export { autenticacaoRotas };
