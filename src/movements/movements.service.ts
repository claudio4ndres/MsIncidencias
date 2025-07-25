import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Between, ILike } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import {
  CalendarRepository,
  EmployeeRepository,
  HolidayRepository,
  IncidentRepository,
  MovementRepository,
  UserAccessRepository,
} from "../_common/repository";
import { MovementEntity, MovementApprovalStatus } from "../_common/repository/entities/movement.entity";
import { UserAccessService } from "../_common/services/user-access.service";
import { UserSessionDto } from "../auth/dto/auth-response.dto";
import {
  CreateMovementDto,
  MovementResponseDto,
  MovementSearchDto,
  UpdateMovementDto,
} from "./dto/movement.dto";
import { MovementValidationService } from "./services/movement-validation.service";
import { PeriodService } from "./services/period.service";

@Injectable()
export class MovementsService {
  constructor(
    private readonly movementRepository: MovementRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly incidentRepository: IncidentRepository,
    private readonly userAccessService: UserAccessService,
    private readonly userAccessRepository: UserAccessRepository,
    private readonly calendarRepository: CalendarRepository,
    private readonly holidayRepository: HolidayRepository,
    private readonly movementValidationService: MovementValidationService,
    private readonly periodService: PeriodService
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
    token: UserSessionDto
  ): Promise<PaginatedResponseDto<MovementResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;
    try {
      // Construir filtro de oficinas basado en el acceso del usuario
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const where = search
        ? [
            {
              employee: {
                employeeName: ILike(`%${search}%`),
                office: officeFilter,
              },
            },
            {
              incident: {
                incidentName: ILike(`%${search}%`),
              },
              employee: {
                office: officeFilter,
              },
            },
            // Búsqueda por código de empleado si el término es numérico
            ...(isNaN(Number(search))
              ? []
              : [
                  {
                    employeeCode: Number(search),
                    employee: {
                      office: officeFilter,
                    },
                  },
                ]),
          ]
        : {
            employee: {
              office: officeFilter,
            },
          };

      const [movements, total] = await Promise.all([
        this.movementRepository.find({
          where,
          skip,
          take: pageSize,
          order: { incidenceDate: "DESC" },
          relations: ["employee", "incident"],
        }),
        this.movementRepository.count({ where }),
      ]);

      const movementsDto = movements.map((movement) =>
        this.mapToResponseDto(movement)
      );
      return new PaginatedResponseDto(movementsDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener los movimientos"
      );
    }
  }

  async findOne(
    id: string,
    token?: UserSessionDto
  ): Promise<MovementResponseDto> {
    const whereCondition: any = { id };

    // Si se proporciona token, aplicar filtro de acceso
    if (token) {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );
      whereCondition.employee = {
        office: officeFilter,
      };
    }

    const movement = await this.movementRepository.findOne({
      where: whereCondition,
      relations: ["employee", "incident"],
    });

    if (!movement) {
      throw new NotFoundException("Movimiento no encontrado");
    }

    return this.mapToResponseDto(movement);
  }

  async create(
    createMovementDto: CreateMovementDto,
    token: UserSessionDto
  ): Promise<MovementResponseDto> {
    console.log("token:", token);
    try {
      // Verificar que el empleado existe
      const employee = await this.employeeRepository.findOne({
        where: { employeeCode: createMovementDto.employee_code },
        relations: ["office"],
      });

      if (!employee) {
        throw new BadRequestException("El empleado especificado no existe");
      }

      // Verificar que el usuario tiene acceso a la oficina del empleado
      const hasAccess = await this.userAccessService.hasAccessToOffice(
        token.id,
        employee.office.id
      );

      if (!hasAccess) {
        throw new BadRequestException(
          "No tienes acceso para crear movimientos en esta oficina"
        );
      }

      // Verificar que el incidente existe
      const incident = await this.incidentRepository.findOne({
        where: { incidentCode: createMovementDto.incident_code },
      });

      if (!incident) {
        throw new BadRequestException("El incidente especificado no existe");
      }
      console.log({
        employee: employee,
        dto: createMovementDto,
      });

      // Determinar automáticamente el período basado en la fecha de incidencia
      const incidenceDate = new Date(createMovementDto.incidence_date);
      const determinedPeriod = await this.findPeriodByIncidenceDate(incidenceDate);
      
      if (!determinedPeriod) {
        throw new BadRequestException(
          `No se encontró un período válido para la fecha de incidencia: ${createMovementDto.incidence_date}`
        );
      }

      console.log(`Período determinado automáticamente: ${determinedPeriod.period} para la fecha ${createMovementDto.incidence_date}`);

      // Generar ID para el movimiento
      const movementId = uuidv4();

      // Validar reglas de negocio usando el servicio de validación con el período determinado automáticamente
      await this.movementValidationService.validateMovementBusinessRules(
        createMovementDto.employee_code,
        createMovementDto.incident_code,
        createMovementDto.incidence_date,
        determinedPeriod.period, // Usar el período determinado automáticamente
        employee,
        movementId,
        token.id
      );

      // Crear y guardar el movimiento con estado de aprobación pendiente
      const savedMovement = await this.movementRepository.save({
        id: movementId,
        employeeCode: createMovementDto.employee_code,
        incidentCode: createMovementDto.incident_code,
        incidenceDate: new Date(createMovementDto.incidence_date),
        incidenceObservation: createMovementDto.incidence_observation,
        incidenceStatus: createMovementDto.incidence_status || 1,
        approvalStatus: MovementApprovalStatus.PENDING,
        updatedAt: new Date(createMovementDto.incidence_date),
      });

      // Persistir en la tabla user_access si no existe ya
      await this.ensureUserAccess(
        token.id,
        employee.office.companyId,
        employee.office.id
      );

      // Cargar las relaciones para la respuesta
      const movementWithRelations = await this.movementRepository.findOne({
        where: { id: savedMovement.id },
        relations: ["employee", "incident"],
      });

      return this.mapToResponseDto(movementWithRelations);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error al crear el movimiento");
    }
  }

  async update(
    updateMovementDto: UpdateMovementDto,
    token: UserSessionDto
  ): Promise<MovementResponseDto> {
    console.log("token:", token);
    const { id, ...updateData } = updateMovementDto;

    // Verificar que el movimiento existe y el usuario tiene acceso
    await this.findOne(id, token);

    try {
      // Si se actualiza el código del empleado, verificar que existe
      if (updateData.employee_code !== undefined) {
        const employee = await this.employeeRepository.findOne({
          where: { employeeCode: updateData.employee_code },
        });

        if (!employee) {
          throw new BadRequestException("El empleado especificado no existe");
        }
      }

      // Si se actualiza el código del incidente, verificar que existe
      if (updateData.incident_code) {
        const incident = await this.incidentRepository.findOne({
          where: { incidentCode: updateData.incident_code },
        });

        if (!incident) {
          throw new BadRequestException("El incidente especificado no existe");
        }
      }

      const updatePayload: any = {
        employeeCode: updateData.employee_code,
        incidentCode: updateData.incident_code,
        incidenceObservation: updateData.incidence_observation,
        incidenceStatus: updateData.incidence_status,
      };

      if (updateData.incidence_date) {
        updatePayload.incidenceDate = new Date(updateData.incidence_date);
      }

      await this.movementRepository.update({ id }, updatePayload);

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al actualizar el movimiento"
      );
    }
  }

  async remove(
    id: string,
    token: UserSessionDto
  ): Promise<{ message: string }> {
    console.log("token:", token);
    // Verificar que el movimiento exists y el usuario tiene acceso
    await this.findOne(id, token);

    try {
      await this.movementRepository.delete({ id });
      return { message: "Movimiento eliminado correctamente" };
    } catch (error) {
      throw new InternalServerErrorException("Error al eliminar el movimiento");
    }
  }

  async findByEmployee(
    employeeCode: number,
    token: UserSessionDto
  ): Promise<MovementResponseDto[]> {
    console.log("token", token);
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const movements = await this.movementRepository.find({
        where: {
          employeeCode,
          employee: {
            office: officeFilter,
          },
        },
        relations: ["employee", "incident"],
        order: { incidenceDate: "DESC" },
      });
      return movements.map((movement) => this.mapToResponseDto(movement));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener movimientos por empleado"
      );
    }
  }

  async findByIncident(
    incidentCode: string,
    token: UserSessionDto
  ): Promise<MovementResponseDto[]> {
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const movements = await this.movementRepository.find({
        where: {
          incidentCode,
          employee: {
            office: officeFilter,
          },
        },
        relations: ["employee", "incident"],
        order: { incidenceDate: "DESC" },
      });
      return movements.map((movement) => this.mapToResponseDto(movement));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener movimientos por incidente"
      );
    }
  }

  async findByStatus(
    status: number,
    token: UserSessionDto
  ): Promise<MovementResponseDto[]> {
    console.log("token:", token);
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const movements = await this.movementRepository.find({
        where: {
          incidenceStatus: status,
          employee: {
            office: officeFilter,
          },
        },
        relations: ["employee", "incident"],
        order: { incidenceDate: "DESC" },
      });
      return movements.map((movement) => this.mapToResponseDto(movement));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener movimientos por estado"
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    token: UserSessionDto
  ): Promise<MovementResponseDto[]> {
    console.log("token:", token);
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const movements = await this.movementRepository.find({
        where: {
          incidenceDate: Between(startDate, endDate),
          employee: {
            office: officeFilter,
          },
        },
        relations: ["employee", "incident"],
        order: { incidenceDate: "DESC" },
      });
      return movements.map((movement) => this.mapToResponseDto(movement));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener movimientos por rango de fechas"
      );
    }
  }

  async search(
    searchDto: MovementSearchDto,
    paginationQuery: PaginationQueryDto,
    token: UserSessionDto
  ): Promise<PaginatedResponseDto<MovementResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;
    console.log("token:", token);
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const whereCondition: any = {
        employee: {
          office: officeFilter,
        },
      };

      if (searchDto.employee_code !== undefined) {
        whereCondition.employeeCode = searchDto.employee_code;
      }

      if (searchDto.incident_code) {
        whereCondition.incidentCode = searchDto.incident_code;
      }

      if (searchDto.incidence_status !== undefined) {
        whereCondition.incidenceStatus = searchDto.incidence_status;
      }

      if (searchDto.start_date && searchDto.end_date) {
        whereCondition.incidenceDate = Between(
          new Date(searchDto.start_date),
          new Date(searchDto.end_date)
        );
      }

      const [movements, total] = await Promise.all([
        this.movementRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { incidenceDate: "DESC" },
          relations: ["employee", "incident"],
        }),
        this.movementRepository.count({ where: whereCondition }),
      ]);

      const movementsDto = movements.map((movement) =>
        this.mapToResponseDto(movement)
      );
      return new PaginatedResponseDto(movementsDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al buscar movimientos");
    }
  }

  async getRecentMovements(
    limit: number = 10,
    token: UserSessionDto
  ): Promise<MovementResponseDto[]> {
    console.log("token:", token);
    try {
      const officeFilter = await this.userAccessService.buildOfficeFilter(
        token
      );

      const movements = await this.movementRepository.find({
        where: {
          employee: {
            office: officeFilter,
          },
        },
        take: limit,
        order: { incidenceDate: "DESC" },
        relations: ["employee", "incident"],
      });
      return movements.map((movement) => this.mapToResponseDto(movement));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener movimientos recientes"
      );
    }
  }

  async getStats(
    startDate?: Date,
    endDate?: Date,
    token?: UserSessionDto
  ): Promise<any> {
    try {
      const whereCondition: any = {};

      // Si se proporciona token, aplicar filtro de acceso
      if (token) {
        const officeFilter = await this.userAccessService.buildOfficeFilter(
          token
        );
        whereCondition.employee = {
          office: officeFilter,
        };
      }

      if (startDate && endDate) {
        whereCondition.incidenceDate = Between(startDate, endDate);
      }

      const [total, active, inactive] = await Promise.all([
        this.movementRepository.count({ where: whereCondition }),
        this.movementRepository.count({
          where: {
            ...whereCondition,
            incidenceStatus: 1,
          },
        }),
        this.movementRepository.count({
          where: {
            ...whereCondition,
            incidenceStatus: 0,
          },
        }),
      ]);

      return {
        total,
        byStatus: { active, inactive },
        period: startDate && endDate ? { startDate, endDate } : "all_time",
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener estadísticas de movimientos"
      );
    }
  }

  /**
   * Encuentra el período correspondiente a una fecha de incidencia
   * usando el PeriodService existente
   */
  private async findPeriodByIncidenceDate(incidenceDate: Date): Promise<any | null> {
    try {
      console.log(`Buscando período para la fecha de incidencia: ${incidenceDate.toISOString()}`);
      
      // Usar el PeriodService existente que ya tiene la lógica implementada
      const determinedPeriod = await this.periodService.findPeriodByDate(incidenceDate);
      
      if (determinedPeriod) {
        console.log(`Período encontrado: ${determinedPeriod.period} para la fecha ${incidenceDate.toISOString()}`);
        return determinedPeriod;
      } else {
        console.log(`No se encontró período para la fecha ${incidenceDate.toISOString()}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al buscar período para fecha ${incidenceDate.toISOString()}:`, error);
      throw new InternalServerErrorException("Error al determinar el período para la fecha de incidencia");
    }
  }

  /**
   * Asegura que el usuario tenga acceso registrado en la tabla user_access
   */
  private async ensureUserAccess(
    userId: string,
    companyId: string,
    officeId: string
  ): Promise<void> {
    // Verificar si ya existe el acceso
    const existingAccess =
      await this.userAccessRepository.findByUserIdAndOffice(userId, officeId);

    if (!existingAccess) {
      // Crear nuevo acceso
      await this.userAccessRepository.save({
        userId,
        companyId,
        officeId,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  private mapToResponseDto(movement: MovementEntity): MovementResponseDto {
    const response: MovementResponseDto = {
      id: movement.id,
      employee_code: movement.employeeCode,
      incident_code: movement.incidentCode,
      incidence_date: movement.incidenceDate,
      incidence_observation: movement.incidenceObservation,
      incidence_status: movement.incidenceStatus,
      created_at: movement.createdAt,
      updated_at: movement.updatedAt,
    };

    if (movement.employee) {
      response.employee = {
        id: movement.employee.id,
        employee_name: movement.employee.employeeName,
        employee_type: movement.employee.employeeType,
      };
    }

    if (movement.incident) {
      response.incident = {
        id: movement.incident.id,
        incident_name: movement.incident.incidentName,
        incident_status: movement.incident.incidentStatus,
      };
    }

    return response;
  }
}
