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
exports.IncidentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
let IncidentsService = class IncidentsService {
    constructor(incidentRepository) {
        this.incidentRepository = incidentRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const whereCondition = search
                ? [
                    { incidentName: (0, typeorm_1.Like)(`%${search}%`) },
                    { incidentCode: (0, typeorm_1.Like)(`%${search}%`) },
                ]
                : {};
            const [incidents, total] = await Promise.all([
                this.incidentRepository.find({
                    where: whereCondition,
                    skip,
                    take: pageSize,
                    order: { createdAt: "DESC" },
                }),
                this.incidentRepository.count({ where: whereCondition }),
            ]);
            const incidentsDto = incidents.map((incident) => this.mapToResponseDto(incident));
            return new pagination_dto_1.PaginatedResponseDto(incidentsDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener los incidentes");
        }
    }
    async findOne(id) {
        const incident = await this.incidentRepository.findOne({
            where: { id },
        });
        if (!incident) {
            throw new common_1.NotFoundException("Incidente no encontrado");
        }
        return this.mapToResponseDto(incident);
    }
    async create(createIncidentDto) {
        try {
            const existingIncident = await this.incidentRepository.findOne({
                where: { incidentCode: createIncidentDto.incident_code },
            });
            if (existingIncident) {
                throw new common_1.ConflictException("Ya existe un incidente con este código");
            }
            const savedIncident = await this.incidentRepository.save({
                id: (0, uuid_1.v4)(),
                incidentCode: createIncidentDto.incident_code,
                incidentName: createIncidentDto.incident_name,
                incidentStatus: createIncidentDto.incident_status,
                updatedAt: new Date(),
            });
            return this.mapToResponseDto(savedIncident);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al crear el incidente");
        }
    }
    async update(updateIncidentDto) {
        const { id, ...updateData } = updateIncidentDto;
        await this.findOne(id);
        try {
            if (updateData.incident_code) {
                const existingIncident = await this.incidentRepository.findOne({
                    where: { incidentCode: updateData.incident_code },
                });
                if (existingIncident && existingIncident.id !== id) {
                    throw new common_1.ConflictException("Ya existe un incidente con este código");
                }
            }
            await this.incidentRepository.update({ id }, {
                incidentCode: updateData.incident_code,
                incidentName: updateData.incident_name,
                incidentStatus: updateData.incident_status,
            });
            return await this.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al actualizar el incidente");
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            await this.incidentRepository.delete({ id });
            return { message: "Incidente eliminado correctamente" };
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ER_ROW_IS_REFERENCED_2") {
                throw new common_1.ConflictException("No se puede eliminar el incidente porque tiene movimientos asociados");
            }
            throw new common_1.InternalServerErrorException("Error al eliminar el incidente");
        }
    }
    async findByStatus(status) {
        try {
            const incidents = await this.incidentRepository.find({
                where: { incidentStatus: status },
                order: { createdAt: "DESC" },
            });
            return incidents.map((incident) => this.mapToResponseDto(incident));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener incidentes por estado");
        }
    }
    async findByCode(code) {
        const incident = await this.incidentRepository.findOne({
            where: { incidentCode: code },
        });
        if (!incident) {
            throw new common_1.NotFoundException("Incidente no encontrado");
        }
        return this.mapToResponseDto(incident);
    }
    async findWithMovements(id) {
        try {
            const incident = await this.incidentRepository.findOne({
                where: { id },
                relations: ["movements", "movements.employee"],
            });
            if (!incident) {
                throw new common_1.NotFoundException("Incidente no encontrado");
            }
            return this.mapToResponseDto(incident);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al obtener el incidente con movimientos");
        }
    }
    async getStats() {
        try {
            const [total, active, inactive] = await Promise.all([
                this.incidentRepository.count(),
                this.incidentRepository.count({ where: { incidentStatus: 1 } }),
                this.incidentRepository.count({ where: { incidentStatus: 0 } }),
            ]);
            return {
                total,
                active,
                inactive,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener estadísticas de incidentes");
        }
    }
    mapToResponseDto(incident) {
        return {
            id: incident.id,
            incident_code: incident.incidentCode,
            incident_name: incident.incidentName,
            incident_status: incident.incidentStatus,
            created_at: incident.createdAt,
            updated_at: incident.updatedAt,
        };
    }
};
IncidentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.IncidentRepository])
], IncidentsService);
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents.service.js.map