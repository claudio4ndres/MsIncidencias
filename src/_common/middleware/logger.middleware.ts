import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { noLogEndpoints } from '@constants';
import { LoggerService } from '@logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    let bodyStr = undefined;
    if (Object.keys(request.body).length !== 0) {
      bodyStr = JSON.stringify(request.body);
    }

    if (!noLogEndpoints.includes(originalUrl)) {
      this.logger.log(
        `${method} ${originalUrl}|FromIp:${ip}${
          !bodyStr ? '' : '|Req-Body: ' + bodyStr
        } |Req-UserAgent:${userAgent}`,
        'Request',
      );
    }

    next();
  }
}
