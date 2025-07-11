import { HttpModule as AxiosHttpModule, HttpService } from '@nestjs/axios';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { noLogEndpoints } from '../constants';
import getPathAfterPort from '../utils/url';

@Global()
@Module({
  imports: [AxiosHttpModule],
  exports: [AxiosHttpModule],
})
export class HttpModule extends AxiosHttpModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
  ) {
    super();
  }

  onModuleInit() {
    // eslint-disable-next-line
    const self = this;
    this.httpService.axiosRef.interceptors.request.use(function (config) {
      if (
        config?.url &&
        !noLogEndpoints.includes(getPathAfterPort(config?.url))
      ) {
        const loggerObj = {
          url: config.url,
          method: config.method,
          body: config.data,
          headers: config?.headers,
          params: config?.params,
        };
        if (loggerObj.url) {
          self.loggerService.log(
            `${loggerObj?.method?.toUpperCase()} Req-Url: ${
              loggerObj.url
            } |Req-Body: ${JSON.stringify(
              loggerObj?.body,
            )} | Req-Headers: ${JSON.stringify(
              loggerObj?.headers,
            )} | Req-Params: ${JSON.stringify(loggerObj.params)}`,
            'External Request',
          );
        }
      }
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      function (response) {
        if (response?.status) {
          const loggerObj = {
            status: response.status,
            body: response.data,
            url: response.request?.res?.responseUrl,
            method: response.request?.method,
          };
          if (
            loggerObj.url &&
            !noLogEndpoints.includes(getPathAfterPort(loggerObj?.url))
          ) {
            self.loggerService.log(
              `${loggerObj?.method?.toUpperCase()} Req-Url: ${
                loggerObj.url
              } |Res-Code:${loggerObj.status}|Res-Body: ${JSON.stringify(
                loggerObj.body,
              )}`,
              'External Response',
            );
          }
        }
        return response;
      },
      function (error) {
        const config = error?.config;
        const loggerObj = {
          message: error?.message,
          url: config?.url,
          method: config?.method,
          body: config?.data,
          responseBody: error?.response?.data,
        };
        self.loggerService.log(
          `${loggerObj?.method.toUpperCase()} URL: ${
            loggerObj?.url
          } | Req-Body: ${JSON.stringify(loggerObj?.body)} | Res-Message: ${
            loggerObj?.message
          } | Res-Body: ${JSON.stringify(loggerObj?.responseBody)}`,
          'External Failed Response',
        );
        throw error;
      },
    );
  }
}
