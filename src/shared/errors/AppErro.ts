export class AppErro extends Error {
  public readonly codigoHttp: number;

  constructor(mensagem: string, codigoHttp = 400) {
    super(mensagem);
    this.codigoHttp = codigoHttp;
    // preserva o nome da classe ao invés de "Error" genérico nos stack traces
    this.name = 'AppErro';
  }
}
