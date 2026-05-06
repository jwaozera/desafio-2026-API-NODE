// tipos da resposta da API Open-Meteo
export interface RespostaOpenMeteo {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
}

// dados climaticos normalizados para uso interno
export interface DadosClimaticos {
  temperaturaAtual: number;
  umidadeAtual: number;
  descricaoClima: string;
  climaAtualizadoEm: Date;
}
