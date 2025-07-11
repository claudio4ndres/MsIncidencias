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
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const _constants_1 = require("../constants");
const logger_service_1 = require("../logger/logger.service");
let LoggerMiddleware = class LoggerMiddleware {
    constructor(logger) {
        this.logger = logger;
    }
    use(request, response, next) {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
        let bodyStr = undefined;
        if (Object.keys(request.body).length !== 0) {
            bodyStr = JSON.stringify(request.body);
        }
        if (!_constants_1.noLogEndpoints.includes(originalUrl)) {
            this.logger.log(`${method} ${originalUrl}|FromIp:${ip}${!bodyStr ? '' : '|Req-Body: ' + bodyStr} |Req-UserAgent:${userAgent}`, 'Request');
        }
        next();
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map