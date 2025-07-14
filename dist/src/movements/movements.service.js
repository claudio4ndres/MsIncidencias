"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
const user_access_service_1 = require("../_common/services/user-access.service");
let MovementsService = class MovementsService {
    constructor(movementRepository, employeeRepository, incidentRepository, userAccessService, userAccessRepository) {
        this.movementRepository = movementRepository;
        this.employeeRepository = employeeRepository;
        this.incidentRepository = incidentRepository;
        this.userAccessService = userAccessService;
        this.userAccessRepository = userAccessRepository;
    }
    async findAll(paginationQuery, token) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
            const where = search
                ? [
                    {
                        employee: {
                            employeeName: (0, typeorm_1.ILike)(`%${search}%`),
                            office: officeFilter,
                        },
                    },
                    {
                        incident: {
                            incidentName: (0, typeorm_1.ILike)(`%${search}%`),
                        },
                        employee: {
                            office: officeFilter,
                        },
                    },
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
            const movementsDto = movements.map((movement) => this.mapToResponseDto(movement));
            return new pagination_dto_1.PaginatedResponseDto(movementsDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener los movimientos");
        }
    }
    async findOne(id, token) {
        const whereCondition = { id };
        if (token) {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
            whereCondition.employee = {
                office: officeFilter,
            };
        }
        const movement = await this.movementRepository.findOne({
            where: whereCondition,
            relations: ["employee", "incident"],
        });
        if (!movement) {
            throw new common_1.NotFoundException("Movimiento no encontrado");
        }
        return this.mapToResponseDto(movement);
    }
    async create(createMovementDto, token) {
        console.log("token:", token);
        try {
            const employee = await this.employeeRepository.findOne({
                where: { employeeCode: createMovementDto.employee_code },
                relations: ["office"],
            });
            if (!employee) {
                throw new common_1.BadRequestException("El empleado especificado no existe");
            }
            const hasAccess = await this.userAccessService.hasAccessToOffice(token.id, employee.office.id);
            if (!hasAccess) {
                throw new common_1.BadRequestException("No tienes acceso para crear movimientos en esta oficina");
            }
            const incident = await this.incidentRepository.findOne({
                where: { incidentCode: createMovementDto.incident_code },
            });
            if (!incident) {
                throw new common_1.BadRequestException("El incidente especificado no existe");
            }
            console.log("employee:", employee);
            return "Movimiento creado exitosamente";
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al crear el movimiento");
        }
    }
    async update(updateMovementDto, token) {
        console.log("token:", token);
        const { id, ...updateData } = updateMovementDto;
        await this.findOne(id, token);
        try {
            if (updateData.employee_code !== undefined) {
                const employee = await this.employeeRepository.findOne({
                    where: { employeeCode: updateData.employee_code },
                });
                if (!employee) {
                    throw new common_1.BadRequestException("El empleado especificado no existe");
                }
            }
            if (updateData.incident_code) {
                const incident = await this.incidentRepository.findOne({
                    where: { incidentCode: updateData.incident_code },
                });
                if (!incident) {
                    throw new common_1.BadRequestException("El incidente especificado no existe");
                }
            }
            const updatePayload = {
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al actualizar el movimiento");
        }
    }
    async remove(id, token) {
        console.log("token:", token);
        await this.findOne(id, token);
        try {
            await this.movementRepository.delete({ id });
            return { message: "Movimiento eliminado correctamente" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al eliminar el movimiento");
        }
    }
    async findByEmployee(employeeCode, token) {
        console.log("token", token);
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener movimientos por empleado");
        }
    }
    async findByIncident(incidentCode, token) {
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener movimientos por incidente");
        }
    }
    async findByStatus(status, token) {
        console.log("token:", token);
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener movimientos por estado");
        }
    }
    async findByDateRange(startDate, endDate, token) {
        console.log("token:", token);
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
            const movements = await this.movementRepository.find({
                where: {
                    incidenceDate: (0, typeorm_1.Between)(startDate, endDate),
                    employee: {
                        office: officeFilter,
                    },
                },
                relations: ["employee", "incident"],
                order: { incidenceDate: "DESC" },
            });
            return movements.map((movement) => this.mapToResponseDto(movement));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener movimientos por rango de fechas");
        }
    }
    async search(searchDto, paginationQuery, token) {
        const { page = 1, pageSize = 10 } = paginationQuery;
        const skip = (page - 1) * pageSize;
        console.log("token:", token);
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
            const whereCondition = {
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
                whereCondition.incidenceDate = (0, typeorm_1.Between)(new Date(searchDto.start_date), new Date(searchDto.end_date));
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
            const movementsDto = movements.map((movement) => this.mapToResponseDto(movement));
            return new pagination_dto_1.PaginatedResponseDto(movementsDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al buscar movimientos");
        }
    }
    async getRecentMovements(limit = 10, token) {
        console.log("token:", token);
        try {
            const officeFilter = await this.userAccessService.buildOfficeFilter(token);
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener movimientos recientes");
        }
    }
    async getStats(startDate, endDate, token) {
        try {
            const whereCondition = {};
            if (token) {
                const officeFilter = await this.userAccessService.buildOfficeFilter(token);
                whereCondition.employee = {
                    office: officeFilter,
                };
            }
            if (startDate && endDate) {
                whereCondition.incidenceDate = (0, typeorm_1.Between)(startDate, endDate);
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener estadísticas de movimientos");
        }
    }
    async ensureUserAccess(userId, companyId, officeId) {
        const existingAccess = await this.userAccessRepository.findByUserIdAndOffice(userId, officeId);
        if (!existingAccess) {
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
    mapToResponseDto(movement) {
        const response = {
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
};
MovementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.MovementRepository,
        repository_1.EmployeeRepository,
        repository_1.IncidentRepository,
        user_access_service_1.UserAccessService,
        repository_1.UserAccessRepository])
], MovementsService);
exports.MovementsService = MovementsService;
//# sourceMappingURL=movements.service.js.map