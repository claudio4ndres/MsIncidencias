import { LoggerService } from '@common/logger/logger.service';
import { LoggerInterceptor } from '@common/interceptor/logger.interceptor';

const mockedLogger = {
  log() {
    return true;
  },
};

const interceptor = new LoggerInterceptor(
  mockedLogger as unknown as LoggerService,
);

describe('Pruebas en el Interceptor "logger"', () => {
  it('debería estar definido', () => {
    expect(interceptor).toBeDefined();
  });

  it('debería interceptar', () => {
    const mockContext = {
      switchToHttp: jest.fn().mockImplementation(() => ({
        getRequest: jest.fn().mockImplementation(() => ({
          originalUrl: 'test',
          method: 'GET',
        })),
        getResponse: jest.fn().mockImplementation(() => ({
          status: jest.fn().mockImplementation(() => ({
            json: jest.fn(),
          })),
        })),
      })),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    const mockNext = {
      handle: jest.fn().mockImplementation(() => ({
        pipe: jest.fn().mockImplementation(() => ({
          map: jest.fn().mockImplementation(() => ({})),
        })),
      })),
    };

    interceptor.intercept(mockContext, mockNext);

    expect(mockContext.switchToHttp).toHaveBeenCalled();
    expect(mockNext.handle).toHaveBeenCalled();
  });
});

describe('LoggerInterceptor', () => {
  let interceptor: LoggerInterceptor;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = new LoggerService();
    interceptor = new LoggerInterceptor(loggerService);
  });

  describe('ofuscarCvv', () => {
    it('debería enmascarar el campo cvv', () => {
      const input = { cvv: '123', other: 'data' };
      const result = interceptor['ofuscarCvv'](input);
      expect(result.cvv).toBe('***');
      expect(result.other).toBe('data');
    });

    it('debería devolver el objeto sin cambios si no existe el campo cvv', () => {
      const input = { other: 'data' };
      const result = interceptor['ofuscarCvv'](input);
      expect(result).toEqual(input);
    });

    it('debería manejar correctamente entradas que no son objetos', () => {
      const input = 'string';
      const result = interceptor['ofuscarCvv'](input);
      expect(result).toBe(input);
    });
  });
});
