import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IncidentEntity, IncidentRepository } from "../_common/repository";
import { IncidentsController } from "./incidents.controller";
import { IncidentsService } from "./incidents.service";

@Module({
  imports: [TypeOrmModule.forFeature([IncidentEntity]), JwtModule.register({})],
  controllers: [IncidentsController],
  providers: [IncidentsService, IncidentRepository],
  exports: [IncidentsService],
})
export class IncidentsModule {}
