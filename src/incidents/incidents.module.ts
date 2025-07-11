import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentEntity, IncidentRepository } from '../_common/repository';
import { JwtAuthGuard } from '../_common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncidentEntity]),
    JwtModule.register({}),
  ],
  controllers: [IncidentsController],
  providers: [
    IncidentsService,
    IncidentRepository,
    JwtAuthGuard,
  ],
  exports: [IncidentsService],
})
export class IncidentsModule {}
