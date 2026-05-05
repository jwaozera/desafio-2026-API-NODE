import { AppErro } from '../AppErro';

describe('AppErro', () => {
  it('deve criar erro com mensagem e código http padrão (400)', () => {
    const erro = new AppErro('Dados inválidos');

    expect(erro.message).toBe('Dados inválidos');
    expect(erro.codigoHttp).toBe(400);
    expect(erro.name).toBe('AppErro');
  });

  it('deve criar erro com código http customizado', () => {
    const erro = new AppErro('Recurso não encontrado', 404);

    expect(erro.message).toBe('Recurso não encontrado');
    expect(erro.codigoHttp).toBe(404);
  });

  it('deve ser instância de Error', () => {
    const erro = new AppErro('Teste');

    expect(erro).toBeInstanceOf(Error);
    expect(erro).toBeInstanceOf(AppErro);
  });
});
