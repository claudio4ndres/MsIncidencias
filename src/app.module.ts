import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { LoggerInterceptor } from "@common/interceptor";
import { LoggerModule } from "@common/logger/logger.module";
import { LoggerMiddleware } from "@common/middleware";
import { DatabaseModule } from "@common/repository/config/database.module";
import { getAppConfig } from "../config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CalendarModule } from "./calendar/calendar.module";
import { CompaniesModule } from "./companies/companies.module";
import { EmployeesModule } from "./employees/employess.module";
import { IncidentsModule } from "./incidents/incidents.module";
import { MovementsModule } from "./movements/movements.module";
import { OfficesModule } from "./offices/offices.module";
import { PeriodsModule } from "./periods/periods.module";
import { UsersModule } from "./users/users.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = getAppConfig();
        return {
          secret: config.jwt.secret,
          signOptions: {
            expiresIn: config.jwt.expiresIn,
          },
        };
      },
    }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    OfficesModule,
    CalendarModule,
    MovementsModule,
    PeriodsModule,
    IncidentsModule,
    EmployeesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
