import axios from 'axios';
import { ClimaServico } from '../services/ClimaServico';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('ClimaServico', () => {
  let servico: ClimaServico;

  beforeEach(() => {
    servico = new ClimaServico();
    jest.clearAllMocks();
  });

  const respostaValidaOpenMeteo = {
    data: {
      current: {
        temperature_2m: 22.3,
        relative_humidity_2m: 65,
        weather_code: 3,
      },
    },
  };

  it('deve retornar dados climaticos quando a api responde com sucesso', async () => {
    axiosMock.get.mockResolvedValue(respostaValidaOpenMeteo);

    const resultado = await servico.consultarClima(-23.55, -46.63);

    expect(resultado).not.toBeNull();
    expect(resultado!.temperaturaAtual).toBe(22.3);
    expect(resultado!.umidadeAtual).toBe(65);
    expect(resultado!.descricaoClima).toBe('Nublado');
    expect(resultado!.climaAtualizadoEm).toBeInstanceOf(Date);
  });

  it('deve chamar a api com os parametros corretos', async () => {
    axiosMock.get.mockResolvedValue(respostaValidaOpenMeteo);

    await servico.consultarClima(-15.78, -47.93);

    expect(axiosMock.get).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast',
      expect.objectContaining({
        params: {
          latitude: -15.78,
          longitude: -47.93,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          timezone: 'auto',
        },
        timeout: 5000,
      }),
    );
  });

  it('deve mapear weather_code 0 para ceu limpo', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        current: { temperature_2m: 30, relative_humidity_2m: 40, weather_code: 0 },
      },
    });

    const resultado = await servico.consultarClima(-23.55, -46.63);
    expect(resultado!.descricaoClima).toBe('Céu limpo');
  });

  it('deve mapear weather_code 61 para chuva leve', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        current: { temperature_2m: 18, relative_humidity_2m: 85, weather_code: 61 },
      },
    });

    const resultado = await servico.consultarClima(-23.55, -46.63);
    expect(resultado!.descricaoClima).toBe('Chuva leve');
  });

  it('deve retornar descricao com codigo wmo para codigos desconhecidos', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        current: { temperature_2m: 18, relative_humidity_2m: 85, weather_code: 999 },
      },
    });

    const resultado = await servico.consultarClima(-23.55, -46.63);
    expect(resultado!.descricaoClima).toBe('Código WMO 999');
  });

  it('deve retornar null quando a api falha por timeout', async () => {
    axiosMock.get.mockRejectedValue({ message: 'timeout', code: 'ECONNABORTED' });
    axiosMock.isAxiosError.mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const resultado = await servico.consultarClima(-23.55, -46.63);

    expect(resultado).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('deve retornar null quando a api retorna formato inesperado', async () => {
    axiosMock.get.mockResolvedValue({
      data: { formato: 'inesperado' },
    });

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const resultado = await servico.consultarClima(-23.55, -46.63);

    expect(resultado).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('deve retornar null quando a api esta fora do ar', async () => {
    axiosMock.get.mockRejectedValue(new Error('Network Error'));
    axiosMock.isAxiosError.mockReturnValue(false);

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const resultado = await servico.consultarClima(-23.55, -46.63);

    expect(resultado).toBeNull();
    consoleSpy.mockRestore();
  });
});
