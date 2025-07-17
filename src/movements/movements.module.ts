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
  Calendar,
  CalendarRepository,
  Holiday,
  HolidayRepository,
  ApprovalEntity,
  ApprovalRepository,
} from "../_common/repository";
import { UserAccessService } from "../_common/services/user-access.service";
import { MovementsController } from "./movements.controller";
import { MovementsService } from "./movements.service";
import { MovementValidationService } from "./services/movement-validation.service";
import { ApprovalService } from "./services/approval.service";
import { ApprovalController } from "./controllers/approval.controller";

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
    JwtAuthGuard,
  ],
  exports: [MovementsService],
})
export class MovementsModule {}
