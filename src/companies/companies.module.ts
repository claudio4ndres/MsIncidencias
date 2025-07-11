import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyEntity, CompanyRepository } from '../_common/repository';
import { JwtAuthGuard } from '../_common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    JwtModule.register({}), // Para el guard
  ],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompanyRepository,
    JwtAuthGuard,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
