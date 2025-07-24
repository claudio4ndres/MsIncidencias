import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity, EmployeeRepository } from "../_common/repository";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity]), JwtModule.register({})],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeRepository],
  exports: [EmployeesService],
})
export class EmployeesModule {}
