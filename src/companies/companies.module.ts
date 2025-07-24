import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyEntity, CompanyRepository } from "../_common/repository";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    JwtModule.register({}), // Para el guard
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyRepository],
  exports: [CompaniesService],
})
export class CompaniesModule {}
