import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  CalendarRepository,
  CompanyEntity,
  CompanyRepository,
} from "../_common/repository";
import { Calendar } from "../_common/repository/entities/calendar.entity";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, Calendar]),
    JwtModule.register({}), // Para el guard
  ],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarRepository, CompanyRepository],
  exports: [CalendarService],
})
export class CalendarModule {}
