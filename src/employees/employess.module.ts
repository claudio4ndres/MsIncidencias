import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "../_common/guards/jwt-auth.guard";
import { EmployeeEntity, EmployeeRepository } from "../_common/repository";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity]), JwtModule.register({})],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeRepository, JwtAuthGuard],
  exports: [EmployeesService],
})
export class EmployeesModule {}
