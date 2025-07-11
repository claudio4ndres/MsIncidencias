import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SecretConfigService } from '@src/_common/config/secret-config/secret-config.service';
import { getSecretWithAssumeRoleAsJson } from '../../../../src/_common/aws/secrets-manager/client';
import { LoggerService } from '@src/_common/logger/logger.service';

jest.mock('../../../../src/_common/aws/secrets-manager/client', () => ({
  getSecretWithAssumeRoleAsJson: jest.fn(),
}));

describe('SecretConfigService', () => {
  let service: SecretConfigService;
  let mockCacheManager: any;
  let mockConfigService: any;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SecretConfigService>(SecretConfigService);
    loggerService = module.get<LoggerService>(LoggerService);
    mockCacheManager = module.get<Cache>(CACHE_MANAGER);
    mockConfigService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('debería devolver el valor en caché si existe', async () => {
      mockCacheManager.get.mockResolvedValueOnce('cached-value');

      const result = await service.get('TEST_CONFIG');

      expect(result).toBe('cached-value');
      expect(mockCacheManager.get).toHaveBeenCalledWith('TEST_CONFIG');
      expect(getSecretWithAssumeRoleAsJson).not.toHaveBeenCalled();
    });

    it('debería obtener el valor desde AWS Secrets Manager si no está en caché', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);
      (getSecretWithAssumeRoleAsJson as jest.Mock).mockResolvedValueOnce({
        key: 'value',
      });

      const result = await service.get('TEST_CONFIG');

      expect(result).toEqual({ key: 'value' });
      expect(mockCacheManager.get).toHaveBeenCalledWith('TEST_CONFIG');
      expect(getSecretWithAssumeRoleAsJson).toHaveBeenCalledWith('TEST_CONFIG');
      expect(mockCacheManager.set).toHaveBeenCalledWith('TEST_CONFIG', {
        key: 'value',
      });
    });

    it('debería registrar en el log el valor obtenido', async () => {
      const loggerSpy = jest.spyOn(loggerService, 'debug');
      mockCacheManager.get.mockResolvedValueOnce(null);
      (getSecretWithAssumeRoleAsJson as jest.Mock).mockResolvedValueOnce(
        'valor',
      );

      await service.get('TEST_CONFIG');

      expect(loggerSpy).toHaveBeenCalledWith(
        `Configuración para TEST_CONFIG: "valor"`,
        'SecretConfigService',
      );
    });
  });

  describe('getMsUrl', () => {
    it('debería devolver el valor desde ConfigService en modo desarrollo', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      mockConfigService.get.mockReturnValueOnce('http://mock-url');

      const result = await service.getMsUrl('MS_PARAMETRO_URL');

      expect(result).toBe('http://mock-url');
      expect(mockConfigService.get).toHaveBeenCalledWith('MS_PARAMETRO_URL');
    });

    it('debería obtener el valor desde AWS Secrets Manager en modo no desarrollo', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'production';
      jest.spyOn(service, 'get').mockResolvedValueOnce({
        SecretJson: { MS_PARAMETRO_URL: 'http://mock-url' },
      });

      const result = await service.getMsUrl('MS_PARAMETRO_URL');

      expect(result).toBe('http://mock-url');
      expect(service.get).toHaveBeenCalledWith('MS_CONFIG');
    });

    it('debería obtener el valor desde un nombre de secreto personalizado si se proporciona', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'production';
      jest.spyOn(service, 'get').mockResolvedValueOnce({
        SecretJson: { MS_PARAMETRO_URL: 'http://custom-url' },
      });

      const result = await service.getMsUrl(
        'MS_PARAMETRO_URL',
        'CUSTOM_SECRET',
      );

      expect(result).toBe('http://custom-url');
      expect(service.get).toHaveBeenCalledWith('CUSTOM_SECRET');
    });
  });
});
