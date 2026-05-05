import request from 'supertest';
import { app } from '../app';

describe('App', () => {
  it('deve retornar status ok no health check', async () => {
    const resposta = await request(app).get('/health');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ status: 'ok' });
  });

  it('deve retornar 404 para rotas inexistentes', async () => {
    const resposta = await request(app).get('/rota-que-nao-existe');

    expect(resposta.status).toBe(404);
  });
});
