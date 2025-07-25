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
  CreateIncidentDto,
  DeleteIncidentDto,
  IncidentResponseDto,
  UpdateIncidentDto,
} from "./dto/incident.dto";
import { IncidentsService } from "./incidents.service";

@ApiTags("Incidentes")
@Controller("incidents")
@UseGuards(TokenGuard, RolesGuard)
@ApiBearerAuth()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Roles(Role.ADMIN, Role.GERENTE, Role.RH)
  @Get()
  @ApiOperation({
    summary: "Obtener lista de incidentes con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de incidentes obtenida exitosamente",
    type: PaginatedResponseDto<IncidentResponseDto>,
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<IncidentResponseDto>> {
    return this.incidentsService.findAll(paginationQuery);
  }
  /*
  @Get("stats")
  @ApiOperation({ summary: "Obtener estadísticas de incidentes" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de incidentes obtenidas exitosamente",
  })
  async getStats(): Promise<any> {
    return this.incidentsService.getStats();
  }

  @Get("status/:status")
  @ApiOperation({ summary: "Obtener incidentes por estado" })
  @ApiResponse({
    status: 200,
    description: "Incidentes obtenidos por estado",
    type: [IncidentResponseDto],
  })
  async findByStatus(
    @Param("status") status: string
  ): Promise<IncidentResponseDto[]> {
    return this.incidentsService.findByStatus(parseInt(status));
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Obtener incidente por código" })
  @ApiResponse({
    status: 200,
    description: "Incidente encontrado",
    type: IncidentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Incidente no encontrado" })
  async findByCode(@Param("code") code: string): Promise<IncidentResponseDto> {
    return this.incidentsService.findByCode(code);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un incidente por ID" })
  @ApiResponse({
    status: 200,
    description: "Incidente encontrado",
    type: IncidentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Incidente no encontrado" })
  async findOne(@Param("id") id: string): Promise<IncidentResponseDto> {
    return this.incidentsService.findOne(id);
  }
 */
  @Get(":id/movements")
  @ApiOperation({ summary: "Obtener incidente con sus movimientos" })
  @ApiResponse({
    status: 200,
    description: "Incidente con movimientos obtenido",
    type: IncidentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Incidente no encontrado" })
  async findWithMovements(
    @Param("id") id: string
  ): Promise<IncidentResponseDto> {
    return this.incidentsService.findWithMovements(id);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Post()
  @ApiOperation({ summary: "Crear un nuevo incidente" })
  @ApiResponse({
    status: 201,
    description: "Incidente creado exitosamente",
    type: IncidentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({
    status: 409,
    description: "Ya existe un incidente con este código",
  })
  async create(
    @Body() createIncidentDto: CreateIncidentDto
  ): Promise<IncidentResponseDto> {
    return this.incidentsService.create(createIncidentDto);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Put()
  @ApiOperation({ summary: "Actualizar un incidente" })
  @ApiResponse({
    status: 200,
    description: "Incidente actualizado exitosamente",
    type: IncidentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Incidente no encontrado" })
  @ApiResponse({
    status: 409,
    description: "Ya existe un incidente con este código",
  })
  async update(
    @Body() updateIncidentDto: UpdateIncidentDto
  ): Promise<IncidentResponseDto> {
    return this.incidentsService.update(updateIncidentDto);
  }
  @Roles(Role.ADMIN, Role.GERENTE)
  @Delete()
  @ApiOperation({ summary: "Eliminar un incidente" })
  @ApiResponse({
    status: 200,
    description: "Incidente eliminado exitosamente",
  })
  @ApiResponse({ status: 404, description: "Incidente no encontrado" })
  @ApiResponse({
    status: 409,
    description:
      "No se puede eliminar el incidente porque tiene movimientos asociados",
  })
  async remove(
    @Body() deleteIncidentDto: DeleteIncidentDto
  ): Promise<{ message: string }> {
    return this.incidentsService.remove(deleteIncidentDto.id);
  }
}
