import { HttpService } from "@nestjs/axios";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { msArquetipoResponseCodes } from "../enums";
import { CustomException } from "../exceptions";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {}

  private lanzarExcepcionCaptchaTokenInvalido = () => {
    throw new CustomException(
      msArquetipoResponseCodes.CaptchaInvalido,
      undefined,
      "Token recaptcha es inválido o está expirado."
    );
  };

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = req.header("x-captcha");

    if (!token) {
      this.lanzarExcepcionCaptchaTokenInvalido();
    }

    try {
      const captchaUrl = await this.configService.get("GG_CAPTCHA_URL");
      const captchaSecret = await this.configService.get("GG_CAPTCHA_SECRET");
      const { data } = await this.httpService.axiosRef.post(
        `${captchaUrl}?secret=${captchaSecret}&response=${token}`
      );
      this.loggerService.debug(
        `Respuesta Google ReCaptcha: ${JSON.stringify(data)}`
      );
      if (data && data.success && data.score >= 0.2) {
        return true;
      }
    } catch (error) {
      this.loggerService.error(`Error al validar recaptcha token: ${error}`);
    }

    this.lanzarExcepcionCaptchaTokenInvalido();
  }
}
