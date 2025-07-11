import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { EmployeeRepository } from "../_common/repository";
import {
  CreateEmployeeDto,
  EmployeeResponseDto,
  UpdateEmployeeDto,
} from "./dto/employee.dto";
import { EmployeeMapper } from "./mappers/employee.mapper";
@Injectable()
export class EmployeesService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition = search
        ? [
            { employeeName: Like(`%${search}%`) },
            { employeeType: Like(`%${search}%`) },
          ]
        : {};

      const [employees, total] = await Promise.all([
        this.employeeRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { createdAt: "DESC" },
          relations: ["office"],
        }),
        this.employeeRepository.count({ where: whereCondition }),
      ]);

      const employeesDto = EmployeeMapper.toResponseDtoArray(employees);
      return new PaginatedResponseDto(employeesDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los empleados");
    }
  }

  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ["office"],
    });
    if (!employee) {
      throw new NotFoundException("Empleado no encontrado");
    }
    return EmployeeMapper.toResponseDto(employee);
  }

  async create(
    createEmployeeDto: CreateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    try {
      const savedEmployee = await this.employeeRepository.save({
        id: uuidv4(),
        officeId: createEmployeeDto.office_id,
        employeeCode: createEmployeeDto.employee_code,
        employeeName: createEmployeeDto.employee_name,
        employeeType: createEmployeeDto.employee_type,
        employeeStatus: createEmployeeDto.employee_status,
        updatedAt: new Date(),
      });
      return EmployeeMapper.toResponseDto(savedEmployee);
    } catch (error) {
      throw new InternalServerErrorException("Error al crear el empleado");
    }
  }

  async update(
    updateEmployeeDto: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    const { id, ...updateData } = updateEmployeeDto;
    await this.findOne(id);

    try {
      await this.employeeRepository.update(
        { id },
        {
          officeId: updateData.office_id,
          employeeCode: updateData.employee_code,
          employeeName: updateData.employee_name,
          employeeType: updateData.employee_type,
          employeeStatus: updateData.employee_status,
        }
      );
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException("Error al actualizar el empleado");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    try {
      await this.employeeRepository.delete({ id });
      return { message: "Empleado eliminado correctamente" };
    } catch (error) {
      throw new InternalServerErrorException("Error al eliminar el empleado");
    }
  }
}
