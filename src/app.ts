import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { handleError } from './shared/middlewares/handleError';
import { autenticacaoRotas } from './modules/auth/routes/autenticacaoRotas';

const app = express();

app.use(cors());
app.use(express.json());

// rota de saude útil para health checks em produção e CI
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// rotas da aplicação
app.use('/auth', autenticacaoRotas);

// middleware de erro deve ser o último registrado
app.use(handleError);

export { app };
