import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "../_common/guards/jwt-auth.guard";
import {
  EmployeeEntity,
  EmployeeRepository,
  IncidentEntity,
  IncidentRepository,
  MovementEntity,
  MovementRepository,
  UserAccessEntity,
  UserAccessRepository,
} from "../_common/repository";
import { UserAccessService } from "../_common/services/user-access.service";
import { MovementsController } from "./movements.controller";
import { MovementsService } from "./movements.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovementEntity,
      EmployeeEntity,
      IncidentEntity,
      UserAccessEntity,
    ]),
    JwtModule.register({}),
  ],
  controllers: [MovementsController],
  providers: [
    MovementsService,
    MovementRepository,
    EmployeeRepository,
    IncidentRepository,
    UserAccessRepository,
    UserAccessService,
    JwtAuthGuard,
  ],
  exports: [MovementsService],
})
export class MovementsModule {}
