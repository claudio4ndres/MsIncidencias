import { ConsoleLogger } from '@nestjs/common';
export declare class LoggerService extends ConsoleLogger {
    log(message: string, context?: any): void;
    debug(message: string, context?: any): void;
    error(message: string, context?: any): void;
}
