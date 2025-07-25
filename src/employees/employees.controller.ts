import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/_common/decorators";
import { Role } from "@src/_common/enums";
import { TokenGuard } from "@src/_common/guards";
import { RolesGuard } from "@src/_common/guards/roles.guard";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import {
  CreateEmployeeDto,
  DeleteEmployeeDto,
  EmployeeResponseDto,
  UpdateEmployeeDto,
} from "./dto/employee.dto";
import { EmployeesService } from "./employees.service";

@ApiTags("Empleados")
@Controller("employees")
@UseGuards(TokenGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @Roles(Role.ADMIN, Role.GERENTE, Role.RH)
  @Get()
  @ApiOperation({
    summary: "Obtener lista de empleados con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de empleados obtenida exitosamente",
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
    return this.employeesService.findAll(paginationQuery);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Get(":id")
  @ApiOperation({ summary: "Obtener un empleado por ID" })
  @ApiResponse({
    status: 200,
    description: "Empleado encontrado",
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: "Empleado no encontrado" })
  async findOne(@Param("id") id: string): Promise<EmployeeResponseDto> {
    return this.employeesService.findOne(id);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Post()
  @ApiOperation({ summary: "Crear un nuevo empleado" })
  @ApiResponse({
    status: 201,
    description: "Empleado creado exitosamente",
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.create(createEmployeeDto);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Put()
  @ApiOperation({ summary: "Actualizar un empleado" })
  @ApiResponse({
    status: 200,
    description: "Empleado actualizado exitosamente",
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: "Empleado no encontrado" })
  async update(
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(updateEmployeeDto);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Delete()
  @ApiOperation({ summary: "Eliminar un empleado" })
  @ApiResponse({ status: 200, description: "Empleado eliminado exitosamente" })
  @ApiResponse({ status: 404, description: "Empleado no encontrado" })
  async remove(
    @Body() deleteEmployeeDto: DeleteEmployeeDto
  ): Promise<{ message: string }> {
    return this.employeesService.remove(deleteEmployeeDto.id);
  }
}
