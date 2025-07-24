import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ApprovalEntity,
  ApprovalRepository,
  Calendar,
  CalendarRepository,
  EmployeeEntity,
  EmployeeRepository,
  Holiday,
  HolidayRepository,
  IncidentEntity,
  IncidentRepository,
  MovementEntity,
  MovementRepository,
  UserAccessEntity,
  UserAccessRepository,
} from "../_common/repository";
import { UserAccessService } from "../_common/services/user-access.service";
import { ApprovalController } from "./controllers/approval.controller";
import { MovementsController } from "./movements.controller";
import { MovementsService } from "./movements.service";
import { ApprovalService } from "./services/approval.service";
import { MovementValidationService } from "./services/movement-validation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovementEntity,
      EmployeeEntity,
      IncidentEntity,
      UserAccessEntity,
      Calendar,
      Holiday,
      ApprovalEntity,
    ]),
    JwtModule.register({}),
  ],
  controllers: [MovementsController, ApprovalController],
  providers: [
    MovementsService,
    MovementRepository,
    EmployeeRepository,
    IncidentRepository,
    UserAccessRepository,
    CalendarRepository,
    HolidayRepository,
    ApprovalRepository,
    UserAccessService,
    MovementValidationService,
    ApprovalService,
  ],
  exports: [MovementsService],
})
export class MovementsModule {}
