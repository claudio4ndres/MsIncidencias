import { HttpService } from '@nestjs/axios';
import { HttpModule } from '@common/interceptor/request-external-log.interceptor';
import { LoggerService } from '@src/_common/logger/logger.service';

describe('HttpModule', () => {
  let httpModule: HttpModule;
  let httpService: HttpService;
  const loggerService: LoggerService = new LoggerService();

  beforeEach(() => {
    httpService = new HttpService();
    httpModule = new HttpModule(httpService, loggerService);
  });

  it('debería registrar los detalles de la solicitud', () => {
    const logSpy = jest.spyOn(loggerService, 'log');
    const config = {
      url: 'http://test.com',
      method: 'GET',
      data: { test: 'test' },
      headers: { 'Content-Type': 'application/json' },
      params: { id: 1 },
    };

    httpModule.onModuleInit();
    // @ts-ignore
    httpService.axiosRef.interceptors.request.handlers[0].fulfilled(config);

    expect(logSpy).toHaveBeenCalledWith(
      'GET Req-Url: http://test.com |Req-Body: {"test":"test"} | Req-Headers: {"Content-Type":"application/json"} | Req-Params: {"id":1}',
      'External Request',
    );
  });

  it('debería registrar los detalles de la respuesta', () => {
    const logSpy = jest.spyOn(loggerService, 'log');
    const response = {
      status: 200,
      data: { test: 'test' },
      request: { res: { responseUrl: 'http://test.com' }, method: 'GET' },
    };

    httpModule.onModuleInit();
    // @ts-ignore
    httpService.axiosRef.interceptors.response.handlers[0].fulfilled(response);

    expect(logSpy).toHaveBeenCalled();
  });

  it('debería registrar correctamente los detalles de la solicitud', () => {
    const logSpy = jest.spyOn(loggerService, 'log');
    const config = {
      url: 'http://test.com',
      method: 'GET',
      data: { test: 'test' },
      headers: { 'Content-Type': 'application/json' },
      params: { id: 1 },
    };

    httpModule.onModuleInit();
    // @ts-ignore
    httpService.axiosRef.interceptors.request.handlers[0].fulfilled(config);

    expect(logSpy).toHaveBeenCalledWith(
      'GET Req-Url: http://test.com |Req-Body: {"test":"test"} | Req-Headers: {"Content-Type":"application/json"} | Req-Params: {"id":1}',
      'External Request',
    );
  });

  it('debería registrar correctamente los detalles de la respuesta', () => {
    const logSpy = jest.spyOn(loggerService, 'log');
    const response = {
      status: 200,
      data: { test: 'test' },
      request: { res: { responseUrl: 'http://test.com' }, method: 'GET' },
    };

    httpModule.onModuleInit();
    // @ts-ignore
    httpService.axiosRef.interceptors.response.handlers[0].fulfilled(response);

    expect(logSpy).toHaveBeenCalledWith(
      'GET Req-Url: http://test.com |Res-Code:200|Res-Body: {"test":"test"}',
      'External Response',
    );
  });
});
