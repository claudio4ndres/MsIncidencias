import { HttpService } from "@nestjs/axios";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "../logger/logger.service";
export declare class CaptchaGuard implements CanActivate {
    private readonly httpService;
    private readonly loggerService;
    private readonly configService;
    constructor(httpService: HttpService, loggerService: LoggerService, configService: ConfigService);
    private lanzarExcepcionCaptchaTokenInvalido;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
