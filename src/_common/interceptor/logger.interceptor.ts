import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { noLogEndpoints } from '@constants';
import { LoggerService } from '@logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { originalUrl, method } = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (!noLogEndpoints.includes(originalUrl)) {
          const logData = this.ofuscarCvv(data);
          this.logger.log(
            `${method} ${originalUrl}|Res-Code:${statusCode}|Res-Body: ${JSON.stringify(
              logData,
            )}`,
            'Response',
          );
        }
        return data;
      }),
    );
  }
  private ofuscarCvv(objeto: any): any {
    if (!objeto || typeof objeto !== 'object') {
      return objeto;
    }

    const newObjeto = { ...objeto };

    if (newObjeto.hasOwnProperty('cvv')) {
      newObjeto.cvv = '***';
    }

    return newObjeto;
  }
}
