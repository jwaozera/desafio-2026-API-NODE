import axios from 'axios';
import { z } from 'zod';
import { DadosClimaticos } from '../types/climaTipos';

// schema para validar a resposta da Open-Meteo (se o formato mudar, falha graciosamente)
const respostaOpenMeteoEsquema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    weather_code: z.number(),
  }),
});

// mapeamento WMO weather codes para descricao em portugues
// ref: https://open-meteo.com/en/docs#weathervariables
const mapaCodigosClima: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Chuvisco leve',
  53: 'Chuvisco moderado',
  55: 'Chuvisco intenso',
  56: 'Chuvisco congelante leve',
  57: 'Chuvisco congelante intenso',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Granizo fino',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve fortes',
  95: 'Tempestade',
  96: 'Tempestade com granizo leve',
  99: 'Tempestade com granizo forte',
};

export class ClimaServico {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly timeoutMs = 5000;

  async consultarClima(latitude: number, longitude: number): Promise<DadosClimaticos | null> {
    try {
      const resposta = await axios.get(this.baseUrl, {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          timezone: 'auto',
        },
        timeout: this.timeoutMs,
      });

      const dadosValidados = respostaOpenMeteoEsquema.safeParse(resposta.data);

      if (!dadosValidados.success) {
        console.warn('resposta da open-meteo em formato inesperado:', dadosValidados.error.message);
        return null;
      }

      const { temperature_2m, relative_humidity_2m, weather_code } = dadosValidados.data.current;

      return {
        temperaturaAtual: temperature_2m,
        umidadeAtual: relative_humidity_2m,
        descricaoClima: mapaCodigosClima[weather_code] ?? `Código WMO ${weather_code}`,
        climaAtualizadoEm: new Date(),
      };
    } catch (erro) {
      // log de aviso mas nunca fatal (a especie é criada mesmo sem clima)
      if (axios.isAxiosError(erro)) {
        console.warn(`falha ao consultar open-meteo: ${erro.message} (${erro.code})`);
      } else {
        console.warn('erro inesperado ao consultar open-meteo:', erro);
      }

      return null;
    }
  }
}
