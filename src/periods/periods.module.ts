import { Module } from '@nestjs/common';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { CalendarRepository } from '@src/_common/repository/calendar.repository';
import { MovementRepository } from '@src/_common/repository/movement.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from '@src/_common/repository/entities/calendar.entity';
import { MovementEntity } from '@src/_common/repository/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, MovementEntity])],
  controllers: [PeriodsController],
  providers: [PeriodsService, CalendarRepository, MovementRepository],
  exports: [PeriodsService],
})
export class PeriodsModule {}
