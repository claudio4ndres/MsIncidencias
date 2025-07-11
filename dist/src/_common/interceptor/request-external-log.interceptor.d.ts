import { HttpModule as AxiosHttpModule, HttpService } from '@nestjs/axios';
import { OnModuleInit } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
export declare class HttpModule extends AxiosHttpModule implements OnModuleInit {
    private readonly httpService;
    private readonly loggerService;
    constructor(httpService: HttpService, loggerService: LoggerService);
    onModuleInit(): void;
}
