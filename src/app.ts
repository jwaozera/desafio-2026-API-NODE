import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { handleError } from './shared/middlewares/handleError';
import { autenticacaoRotas } from './modules/auth/routes/autenticacaoRotas';
import { especieRotas } from './modules/species/routes/especieRotas';

const app = express();

// seguranca: headers http e limitacao de requisicoes
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // maximo 100 requests por ip por janela
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'erro',
      mensagem: 'Muitas requisições. Tente novamente em 15 minutos.',
    },
  }),
);

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// rota de saude útil para health checks em produção e CI
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// rotas da aplicação
app.use('/auth', autenticacaoRotas);
app.use('/especies', especieRotas);

// middleware de erro deve ser o último registrado
app.use(handleError);

export { app };
