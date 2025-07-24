import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfficeEntity, OfficeRepository } from "../_common/repository";
import { OfficesController } from "./offices.controller";
import { OfficesService } from "./offices.service";

@Module({
  imports: [TypeOrmModule.forFeature([OfficeEntity]), JwtModule.register({})],
  controllers: [OfficesController],
  providers: [OfficesService, OfficeRepository],
  exports: [OfficesService],
})
export class OfficesModule {}
