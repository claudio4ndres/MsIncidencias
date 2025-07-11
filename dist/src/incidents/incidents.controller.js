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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const incident_dto_1 = require("./dto/incident.dto");
const incidents_service_1 = require("./incidents.service");
let IncidentsController = class IncidentsController {
    constructor(incidentsService) {
        this.incidentsService = incidentsService;
    }
    async findAll(paginationQuery) {
        return this.incidentsService.findAll(paginationQuery);
    }
    async getStats() {
        return this.incidentsService.getStats();
    }
    async findByStatus(status) {
        return this.incidentsService.findByStatus(parseInt(status));
    }
    async findByCode(code) {
        return this.incidentsService.findByCode(code);
    }
    async findOne(id) {
        return this.incidentsService.findOne(id);
    }
    async findWithMovements(id) {
        return this.incidentsService.findWithMovements(id);
    }
    async create(createIncidentDto) {
        return this.incidentsService.create(createIncidentDto);
    }
    async update(updateIncidentDto) {
        return this.incidentsService.update(updateIncidentDto);
    }
    async remove(deleteIncidentDto) {
        return this.incidentsService.remove(deleteIncidentDto.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Obtener lista de incidentes con paginación y búsqueda",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de incidentes obtenida exitosamente",
        type: (pagination_dto_1.PaginatedResponseDto),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener estadísticas de incidentes" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Estadísticas de incidentes obtenidas exitosamente",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("status/:status"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener incidentes por estado" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidentes obtenidos por estado",
        type: [incident_dto_1.IncidentResponseDto],
    }),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)("code/:code"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener incidente por código" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidente encontrado",
        type: incident_dto_1.IncidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Incidente no encontrado" }),
    __param(0, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener un incidente por ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidente encontrado",
        type: incident_dto_1.IncidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Incidente no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/movements"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener incidente con sus movimientos" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidente con movimientos obtenido",
        type: incident_dto_1.IncidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Incidente no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "findWithMovements", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear un nuevo incidente" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Incidente creado exitosamente",
        type: incident_dto_1.IncidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Ya existe un incidente con este código",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_dto_1.CreateIncidentDto]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar un incidente" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidente actualizado exitosamente",
        type: incident_dto_1.IncidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Incidente no encontrado" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Ya existe un incidente con este código",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_dto_1.UpdateIncidentDto]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar un incidente" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Incidente eliminado exitosamente",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Incidente no encontrado" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "No se puede eliminar el incidente porque tiene movimientos asociados",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_dto_1.DeleteIncidentDto]),
    __metadata("design:returntype", Promise)
], IncidentsController.prototype, "remove", null);
IncidentsController = __decorate([
    (0, swagger_1.ApiTags)("Incidentes"),
    (0, common_1.Controller)("incidents"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [incidents_service_1.IncidentsService])
], IncidentsController);
exports.IncidentsController = IncidentsController;
//# sourceMappingURL=incidents.controller.js.map