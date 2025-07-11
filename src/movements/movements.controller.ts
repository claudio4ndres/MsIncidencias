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
import { TokenDecorator } from "@src/_common/decorators";
import { TokenGuard } from "@src/_common/guards";
import { IAccessToken } from "@src/_common/interfaces";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { UserSessionDto } from "../auth/dto/auth-response.dto";
import {
  CreateMovementDto,
  DeleteMovementDto,
  MovementResponseDto,
  MovementSearchDto,
  UpdateMovementDto,
} from "./dto/movement.dto";
import { MovementsService } from "./movements.service";

@ApiTags("Movimientos")
@UseGuards(TokenGuard)
@Controller("movements")
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  /**
   * Convertir IAccessToken a UserSessionDto
   */
  private convertTokenToUserSession(token: IAccessToken): UserSessionDto {
    return {
      id: token.sub, // IAccessToken usa 'sub' como identificador
      name: "Usuario", // Valor por defecto
      email: "usuario@ejemplo.com", // Valor por defecto
      role: 1, // Valor por defecto
    };
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: "Obtener lista de movimientos con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de movimientos obtenida exitosamente",
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @TokenDecorator() token: UserSessionDto
  ): Promise<PaginatedResponseDto<MovementResponseDto>> {
    return this.movementsService.findAll(paginationQuery, token);
  }
  @ApiBearerAuth()
  @Post("search")
  @ApiOperation({ summary: "Buscar movimientos con filtros avanzados" })
  @ApiResponse({
    status: 200,
    description: "Búsqueda de movimientos realizada exitosamente",
  })
  async search(
    @Body() searchDto: MovementSearchDto,
    @Query() paginationQuery: PaginationQueryDto,
    @TokenDecorator() token: IAccessToken
  ): Promise<PaginatedResponseDto<MovementResponseDto>> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.search(
      searchDto,
      paginationQuery,
      userSession
    );
  }

  @Get("stats")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener estadísticas de movimientos" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de movimientos obtenidas exitosamente",
  })
  async getStats(
    @Query("start_date") startDate?: string,
    @Query("end_date") endDate?: string,
    @TokenDecorator() token?: IAccessToken
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const userSession = token
      ? this.convertTokenToUserSession(token)
      : undefined;
    return this.movementsService.getStats(start, end, userSession);
  }

  @Get("recent")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener movimientos recientes" })
  @ApiResponse({
    status: 200,
    description: "Movimientos recientes obtenidos exitosamente",
    type: [MovementResponseDto],
  })
  async getRecent(
    @Query("limit") limit?: string,
    @TokenDecorator() token?: IAccessToken
  ): Promise<MovementResponseDto[]> {
    const limitNumber = limit ? parseInt(limit) : 10;
    const userSession = token
      ? this.convertTokenToUserSession(token)
      : undefined;
    return this.movementsService.getRecentMovements(limitNumber, userSession);
  }

  @Get("employee/:employeeCode")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener movimientos por código de empleado" })
  @ApiResponse({
    status: 200,
    description: "Movimientos obtenidos por empleado",
    type: [MovementResponseDto],
  })
  async findByEmployee(
    @Param("employeeCode") employeeCode: string,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto[]> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.findByEmployee(
      parseInt(employeeCode),
      userSession
    );
  }

  @Get("incident/:incidentCode")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener movimientos por código de incidente" })
  @ApiResponse({
    status: 200,
    description: "Movimientos obtenidos por incidente",
    type: [MovementResponseDto],
  })
  async findByIncident(
    @Param("incidentCode") incidentCode: string,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto[]> {
    // Convertir IAccessToken a UserSessionDto
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.findByIncident(incidentCode, userSession);
  }
  /*
  @Get("status/:status")
  @ApiB earerAuth()
  @ApiOperation({ summary: "Obtener movimientos por estado" })
  @ApiResponse({
    status: 200,
    description: "Movimientos obtenidos por estado",
    type: [MovementResponseDto],
  })
  async findByStatus(
    @Param("status") status: string,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto[]> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.findByStatus(parseInt(status), userSession);
  }
 */
  @Get("date-range")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener movimientos por rango de fechas" })
  @ApiResponse({
    status: 200,
    description: "Movimientos obtenidos por rango de fechas",
    type: [MovementResponseDto],
  })
  async findByDateRange(
    @Query("start_date") startDate: string,
    @Query("end_date") endDate: string,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto[]> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
      userSession
    );
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener un movimiento por ID" })
  @ApiResponse({
    status: 200,
    description: "Movimiento encontrado",
    type: MovementResponseDto,
  })
  @ApiResponse({ status: 404, description: "Movimiento no encontrado" })
  async findOne(
    @Param("id") id: string,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.findOne(id, userSession);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear un nuevo movimiento" })
  @ApiResponse({
    status: 201,
    description: "Movimiento creado exitosamente",
    type: MovementResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos o empleado/incidente no existe",
  })
  async create(
    @Body() createMovementDto: CreateMovementDto,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.create(createMovementDto, userSession);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar un movimiento" })
  @ApiResponse({
    status: 200,
    description: "Movimiento actualizado exitosamente",
    type: MovementResponseDto,
  })
  @ApiResponse({ status: 404, description: "Movimiento no encontrado" })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos o empleado/incidente no existe",
  })
  async update(
    @Body() updateMovementDto: UpdateMovementDto,
    @TokenDecorator() token: IAccessToken
  ): Promise<MovementResponseDto> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.update(updateMovementDto, userSession);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar un movimiento" })
  @ApiResponse({
    status: 200,
    description: "Movimiento eliminado exitosamente",
  })
  @ApiResponse({ status: 404, description: "Movimiento no encontrado" })
  async remove(
    @Body() deleteMovementDto: DeleteMovementDto,
    @TokenDecorator() token: IAccessToken
  ): Promise<{ message: string }> {
    const userSession = this.convertTokenToUserSession(token);
    return this.movementsService.remove(deleteMovementDto.id, userSession);
  }
}
