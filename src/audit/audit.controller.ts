import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { Roles } from "@src/_common/decorators";
import { Role } from "@src/_common/enums";
import { TokenGuard } from "@src/_common/guards";
import { RolesGuard } from "@src/_common/guards/roles.guard";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { AuditService } from "./audit.service";
import {
  AuditLogResponseDto,
  AuditLogSearchDto,
  AuditLogStatsDto,
} from "./dto/audit.dto";

@ApiTags("Auditoría")
@UseGuards(TokenGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: "Obtener lista de registros de auditoría con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de registros de auditoría obtenida exitosamente",
    type: PaginatedResponseDto<AuditLogResponseDto>,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<AuditLogResponseDto>> {
    return this.auditService.findAll(paginationQuery);
  }

  @ApiBearerAuth()
  @Post("search")
  @ApiOperation({ summary: "Buscar registros de auditoría con filtros avanzados" })
  @ApiResponse({
    status: 200,
    description: "Búsqueda de registros de auditoría realizada exitosamente",
    type: PaginatedResponseDto<AuditLogResponseDto>,
  })
  async search(
    @Body() searchDto: AuditLogSearchDto,
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<AuditLogResponseDto>> {
    return this.auditService.search(searchDto, paginationQuery);
  }

  @ApiBearerAuth()
  @Get("stats")
  @ApiOperation({ summary: "Obtener estadísticas de auditoría" })
  @ApiQuery({
    name: "start_date",
    required: false,
    description: "Fecha de inicio para filtrar estadísticas",
  })
  @ApiQuery({
    name: "end_date",
    required: false,
    description: "Fecha de fin para filtrar estadísticas",
  })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de auditoría obtenidas exitosamente",
    type: AuditLogStatsDto,
  })
  async getStats(
    @Query("start_date") startDate?: string,
    @Query("end_date") endDate?: string
  ): Promise<AuditLogStatsDto> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.auditService.getStats(start, end);
  }

  @ApiBearerAuth()
  @Get("recent")
  @ApiOperation({ summary: "Obtener registros de auditoría recientes" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Número máximo de registros a retornar",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Registros de auditoría recientes obtenidos exitosamente",
    type: [AuditLogResponseDto],
  })
  async getRecent(@Query("limit") limit?: string): Promise<AuditLogResponseDto[]> {
    const limitNumber = limit ? parseInt(limit) : 50;
    return this.auditService.getRecent(limitNumber);
  }

  @ApiBearerAuth()
  @Get("user/:userId")
  @ApiOperation({ summary: "Obtener registros de auditoría por ID de usuario" })
  @ApiResponse({
    status: 200,
    description: "Registros de auditoría por usuario obtenidos exitosamente",
    type: [AuditLogResponseDto],
  })
  async findByUserId(@Param("userId") userId: string): Promise<AuditLogResponseDto[]> {
    return this.auditService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @Get("email/:userEmail")
  @ApiOperation({ summary: "Obtener registros de auditoría por email de usuario" })
  @ApiResponse({
    status: 200,
    description: "Registros de auditoría por email obtenidos exitosamente",
    type: [AuditLogResponseDto],
  })
  async findByUserEmail(@Param("userEmail") userEmail: string): Promise<AuditLogResponseDto[]> {
    return this.auditService.findByUserEmail(userEmail);
  }

  @ApiBearerAuth()
  @Get("date-range")
  @ApiOperation({ summary: "Obtener registros de auditoría por rango de fechas" })
  @ApiQuery({
    name: "start_date",
    required: true,
    description: "Fecha de inicio del rango",
  })
  @ApiQuery({
    name: "end_date",
    required: true,
    description: "Fecha de fin del rango",
  })
  @ApiResponse({
    status: 200,
    description: "Registros de auditoría por rango de fechas obtenidos exitosamente",
    type: [AuditLogResponseDto],
  })
  async findByDateRange(
    @Query("start_date") startDate: string,
    @Query("end_date") endDate: string
  ): Promise<AuditLogResponseDto[]> {
    return this.auditService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOperation({ summary: "Obtener un registro de auditoría por ID" })
  @ApiResponse({
    status: 200,
    description: "Registro de auditoría encontrado",
    type: AuditLogResponseDto,
  })
  @ApiResponse({ status: 404, description: "Registro de auditoría no encontrado" })
  async findOne(@Param("id") id: string): Promise<AuditLogResponseDto> {
    return this.auditService.findOne(id);
  }

  @ApiBearerAuth()
  @Delete("cleanup")
  @ApiOperation({ summary: "Eliminar registros de auditoría antiguos" })
  @ApiQuery({
    name: "days",
    required: false,
    description: "Número de días a conservar (por defecto 90)",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Registros antiguos eliminados exitosamente",
  })
  async deleteOldLogs(@Query("days") days?: string): Promise<{ deleted: number }> {
    const daysToKeep = days ? parseInt(days) : 90;
    return this.auditService.deleteOldLogs(daysToKeep);
  }
}
