"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const interceptor_1 = require("./_common/interceptor");
const logger_module_1 = require("./_common/logger/logger.module");
const middleware_1 = require("./_common/middleware");
const database_module_1 = require("./_common/repository/config/database.module");
const config_2 = require("../config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const calendar_module_1 = require("./calendar/calendar.module");
const companies_module_1 = require("./companies/companies.module");
const employess_module_1 = require("./employees/employess.module");
const incidents_module_1 = require("./incidents/incidents.module");
const movements_module_1 = require("./movements/movements.module");
const offices_module_1 = require("./offices/offices.module");
const periods_module_1 = require("./periods/periods.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middleware_1.LoggerMiddleware).forRoutes("*");
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [".env.local", ".env"],
            }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const config = (0, config_2.getAppConfig)();
                    return {
                        secret: config.jwt.secret,
                        signOptions: {
                            expiresIn: config.jwt.expiresIn,
                        },
                    };
                },
            }),
            logger_module_1.LoggerModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
            offices_module_1.OfficesModule,
            calendar_module_1.CalendarModule,
            movements_module_1.MovementsModule,
            periods_module_1.PeriodsModule,
            incidents_module_1.IncidentsModule,
            employess_module_1.EmployeesModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    transform: true,
                    whitelist: true,
                    forbidNonWhitelisted: true,
                }),
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptor_1.LoggerInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map