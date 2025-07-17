import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import { MovementEntity } from "@src/_common/repository/entities/movement.entity";
import { MovementRepository } from "@src/_common/repository/movement.repository";
import { JwtAuthGuard } from "../_common/guards/jwt-auth.guard";
import { PeriodsController } from "./periods.controller";
import { PeriodsService } from "./periods.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, MovementEntity]),
    JwtModule.register({}),
  ],
  controllers: [PeriodsController],
  providers: [
    PeriodsService,
    CalendarRepository,
    MovementRepository,
    JwtAuthGuard,
  ],
  exports: [PeriodsService],
})
export class PeriodsModule {}
