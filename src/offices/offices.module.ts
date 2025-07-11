import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { OfficeEntity, OfficeRepository } from '../_common/repository';
import { JwtAuthGuard } from '../_common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfficeEntity]),
    JwtModule.register({}),
  ],
  controllers: [OfficesController],
  providers: [OfficesService, OfficeRepository, JwtAuthGuard],
  exports: [OfficesService],
})
export class OfficesModule {}
