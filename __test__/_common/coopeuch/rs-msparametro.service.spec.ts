import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { RsMsParametro } from '@common/coopeuch/rs-msparametro.service';
import { CustomException } from '@src/_common/exceptions';
import { SecretConfigService } from '@src/_common/config/secret-config/secret-config.service';

describe('RsMsParametro', () => {
  let service: RsMsParametro;
  let httpService: HttpService;
  let configService: SecretConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsMsParametro,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: SecretConfigService,
          useValue: {
            get: jest.fn(),
            getMsUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RsMsParametro>(RsMsParametro);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<SecretConfigService>(SecretConfigService);
  });

  describe('obtenerParametros', () => {
    it('debería devolver un objeto vacío cuando los datos están vacíos y retornarComoObjecto es verdadero', async () => {
      jest
        .spyOn(configService, 'getMsUrl')
        .mockReturnValue('http://mock-url' as any);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({ data: [] });

      const result = await service.obtenerParametros(
        'test-servicio',
        'test-captcha',
        true,
        'codigo',
      );

      expect(result).toEqual({});
      expect(configService.getMsUrl).toHaveBeenCalledWith('MS_PARAMETRO_URL');
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'http://mock-url/parametro/test-servicio/obtener',
        { headers: { 'x-captcha': 'test-captcha' } },
      );
    });

    it('debería mapear los datos correctamente cuando propiedadMap no se proporciona', async () => {
      const mockResponse = [
        { codigo: '001', descripcion: 'Parametro 1' },
        { codigoFuse: '002', descripcion: 'Parametro 2' },
      ];

      jest
        .spyOn(configService, 'getMsUrl')
        .mockReturnValue('http://mock-url' as any);
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValue({ data: mockResponse });

      const result = await service.obtenerParametros(
        'test-servicio',
        'test-captcha',
        true,
      );

      expect(result).toEqual({
        '001': { codigo: '001', descripcion: 'Parametro 1' },
        '002': { codigoFuse: '002', descripcion: 'Parametro 2' },
      });
      expect(configService.getMsUrl).toHaveBeenCalledWith('MS_PARAMETRO_URL');
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'http://mock-url/parametro/test-servicio/obtener',
        { headers: { 'x-captcha': 'test-captcha' } },
      );
    });

    it('debería lanzar CustomException cuando getMsUrl falla', async () => {
      jest
        .spyOn(configService, 'getMsUrl')
        .mockRejectedValue(new Error('Config Error'));

      await expect(
        service.obtenerParametros('test-servicio', 'test-captcha'),
      ).rejects.toThrow(CustomException);

      expect(configService.getMsUrl).toHaveBeenCalledWith('MS_PARAMETRO_URL');
      expect(httpService.axiosRef.get).not.toHaveBeenCalled();
    });
  });

  describe('obtenerUf', () => {
    it('debería manejar una respuesta vacía correctamente', async () => {
      jest
        .spyOn(configService, 'getMsUrl')
        .mockReturnValue('http://mock-url' as any);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({ data: null });

      const result = await service.obtenerUf();

      expect(result).toBeNull();
      expect(configService.getMsUrl).toHaveBeenCalledWith('MS_PARAMETRO_URL');
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'http://mock-url/parametro/uf/valor/obtener',
      );
    });

    it('debería lanzar CustomException cuando getMsUrl falla', async () => {
      jest
        .spyOn(configService, 'getMsUrl')
        .mockRejectedValue(new Error('Config Error'));

      await expect(service.obtenerUf()).rejects.toThrow(CustomException);

      expect(configService.getMsUrl).toHaveBeenCalledWith('MS_PARAMETRO_URL');
      expect(httpService.axiosRef.get).not.toHaveBeenCalled();
    });
  });
});
