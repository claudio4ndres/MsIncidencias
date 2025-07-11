import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  log(message: string, context?: any) {
    if (typeof context === 'object') {
      super.log(`${message}, ${JSON.stringify(context, null, 2)}`);
      return;
    }
    super.log(message, context);
  }
  debug(message: string, context?: any) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      if (typeof context === 'object') {
        super.debug(`${message}, ${JSON.stringify(context, null, 2)}`);
        return;
      }
      super.debug(message, context);
    }
  }
  error(message: string, context?: any) {
    if (typeof context === 'object') {
      super.error(`${message}, ${JSON.stringify(context, null, 2)}`);
      return;
    }
    super.error(message, context);
  }
}
