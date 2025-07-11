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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const constants_1 = require("../constants");
const url_1 = __importDefault(require("../utils/url"));
let HttpModule = class HttpModule extends axios_1.HttpModule {
    constructor(httpService, loggerService) {
        super();
        this.httpService = httpService;
        this.loggerService = loggerService;
    }
    onModuleInit() {
        const self = this;
        this.httpService.axiosRef.interceptors.request.use(function (config) {
            if (config?.url &&
                !constants_1.noLogEndpoints.includes((0, url_1.default)(config?.url))) {
                const loggerObj = {
                    url: config.url,
                    method: config.method,
                    body: config.data,
                    headers: config?.headers,
                    params: config?.params,
                };
                if (loggerObj.url) {
                    self.loggerService.log(`${loggerObj?.method?.toUpperCase()} Req-Url: ${loggerObj.url} |Req-Body: ${JSON.stringify(loggerObj?.body)} | Req-Headers: ${JSON.stringify(loggerObj?.headers)} | Req-Params: ${JSON.stringify(loggerObj.params)}`, 'External Request');
                }
            }
            return config;
        });
        this.httpService.axiosRef.interceptors.response.use(function (response) {
            if (response?.status) {
                const loggerObj = {
                    status: response.status,
                    body: response.data,
                    url: response.request?.res?.responseUrl,
                    method: response.request?.method,
                };
                if (loggerObj.url &&
                    !constants_1.noLogEndpoints.includes((0, url_1.default)(loggerObj?.url))) {
                    self.loggerService.log(`${loggerObj?.method?.toUpperCase()} Req-Url: ${loggerObj.url} |Res-Code:${loggerObj.status}|Res-Body: ${JSON.stringify(loggerObj.body)}`, 'External Response');
                }
            }
            return response;
        }, function (error) {
            const config = error?.config;
            const loggerObj = {
                message: error?.message,
                url: config?.url,
                method: config?.method,
                body: config?.data,
                responseBody: error?.response?.data,
            };
            self.loggerService.log(`${loggerObj?.method.toUpperCase()} URL: ${loggerObj?.url} | Req-Body: ${JSON.stringify(loggerObj?.body)} | Res-Message: ${loggerObj?.message} | Res-Body: ${JSON.stringify(loggerObj?.responseBody)}`, 'External Failed Response');
            throw error;
        });
    }
};
HttpModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        exports: [axios_1.HttpModule],
    }),
    __metadata("design:paramtypes", [axios_1.HttpService,
        logger_service_1.LoggerService])
], HttpModule);
exports.HttpModule = HttpModule;
//# sourceMappingURL=request-external-log.interceptor.js.map