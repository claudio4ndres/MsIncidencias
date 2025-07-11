"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaGuard = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("../enums");
const exceptions_1 = require("../exceptions");
const logger_service_1 = require("../logger/logger.service");
let CaptchaGuard = class CaptchaGuard {
    constructor(httpService, loggerService, configService) {
        this.httpService = httpService;
        this.loggerService = loggerService;
        this.configService = configService;
        this.lanzarExcepcionCaptchaTokenInvalido = () => {
            throw new exceptions_1.CustomException(enums_1.msArquetipoResponseCodes.CaptchaInvalido, undefined, "Token recaptcha es inválido o está expirado.");
        };
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = req.header("x-captcha");
        if (!token) {
            this.lanzarExcepcionCaptchaTokenInvalido();
        }
        try {
            const captchaUrl = await this.configService.get("GG_CAPTCHA_URL");
            const captchaSecret = await this.configService.get("GG_CAPTCHA_SECRET");
            const { data } = await this.httpService.axiosRef.post(`${captchaUrl}?secret=${captchaSecret}&response=${token}`);
            this.loggerService.debug(`Respuesta Google ReCaptcha: ${JSON.stringify(data)}`);
            if (data && data.success && data.score >= 0.2) {
                return true;
            }
        }
        catch (error) {
            this.loggerService.error(`Error al validar recaptcha token: ${error}`);
        }
        this.lanzarExcepcionCaptchaTokenInvalido();
    }
};
CaptchaGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        logger_service_1.LoggerService,
        config_1.ConfigService])
], CaptchaGuard);
exports.CaptchaGuard = CaptchaGuard;
//# sourceMappingURL=captcha.guard.js.map