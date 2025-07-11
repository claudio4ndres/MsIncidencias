import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "../_common/guards/jwt-auth.guard";
import { CompanyEntity, CompanyRepository, CalendarRepository } from "../_common/repository";
import { Calendar } from "../_common/repository/entities/calendar.entity";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
  imports: [
TypeOrmModule.forFeature([CompanyEntity, Calendar]),
    JwtModule.register({}), // Para el guard
  ],
  controllers: [CalendarController],
providers: [CalendarService, CalendarRepository, CompanyRepository, JwtAuthGuard],
  exports: [CalendarService],
})
export class CalendarModule {}
