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
exports.LoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const _constants_1 = require("../constants");
const logger_service_1 = require("../logger/logger.service");
let LoggerInterceptor = class LoggerInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const { originalUrl, method } = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (!_constants_1.noLogEndpoints.includes(originalUrl)) {
                const logData = this.ofuscarCvv(data);
                this.logger.log(`${method} ${originalUrl}|Res-Code:${statusCode}|Res-Body: ${JSON.stringify(logData)}`, 'Response');
            }
            return data;
        }));
    }
    ofuscarCvv(objeto) {
        if (!objeto || typeof objeto !== 'object') {
            return objeto;
        }
        const newObjeto = { ...objeto };
        if (newObjeto.hasOwnProperty('cvv')) {
            newObjeto.cvv = '***';
        }
        return newObjeto;
    }
};
LoggerInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerInterceptor);
exports.LoggerInterceptor = LoggerInterceptor;
//# sourceMappingURL=logger.interceptor.js.map