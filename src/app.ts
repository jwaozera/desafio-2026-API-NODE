import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { handleError } from './shared/middlewares/handleError';

const app = express();

app.use(cors());
app.use(express.json());

// rota de saude  útil para health checks em produção e CI
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// o middleware de erro precisa ser o último registrado
app.use(handleError);

export { app };
