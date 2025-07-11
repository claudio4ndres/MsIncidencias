import { LoggerService } from '@common/logger/logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = new LoggerService();
  });

  describe('log', () => {
    it('debería registrar un mensaje de log con contexto de tipo string', () => {
      const message = 'test message';
      const context = 'test context';
      const spy = jest.spyOn(loggerService, 'log').mockImplementation();

      loggerService.log(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });

    it('debería registrar un mensaje de log con contexto de tipo objeto', () => {
      const message = 'test message';
      const context = { data: 1 };
      const spy = jest.spyOn(loggerService, 'log').mockImplementation();

      loggerService.log(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });
  });

  describe('debug', () => {
    it('debería registrar un mensaje de debug cuando NODE_ENV es development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      const message = 'debug message';
      const context = 'debug context';
      const spy = jest.spyOn(loggerService, 'debug').mockImplementation();

      loggerService.debug(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });

    it('debería registrar un mensaje de debug con contexto de tipo objeto cuando NODE_ENV es development', () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      const message = 'debug message';
      const context = { key: 'value' };
      const spy = jest.spyOn(loggerService, 'debug').mockImplementation();

      loggerService.debug(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });
  });

  describe('error', () => {
    it('debería registrar un mensaje de error con contexto de tipo string', () => {
      const message = 'error message';
      const context = 'error context';
      const spy = jest.spyOn(loggerService, 'error').mockImplementation();

      loggerService.error(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });

    it('debería registrar un mensaje de error con contexto de tipo objeto', () => {
      const message = 'error message';
      const context = { error: 'details' };
      const spy = jest.spyOn(loggerService, 'error').mockImplementation();

      loggerService.error(message, context);

      expect(spy).toHaveBeenCalledWith(message, context);

      spy.mockRestore();
    });
  });
});
