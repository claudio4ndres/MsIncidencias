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
exports.MovementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../_common/decorators");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const auth_response_dto_1 = require("../auth/dto/auth-response.dto");
const movement_dto_1 = require("./dto/movement.dto");
const movements_service_1 = require("./movements.service");
let MovementsController = class MovementsController {
    constructor(movementsService) {
        this.movementsService = movementsService;
    }
    convertTokenToUserSession(token) {
        return {
            id: token.sub,
            name: "Usuario",
            email: "usuario@ejemplo.com",
            role: 1,
        };
    }
    async findAll(paginationQuery, token) {
        return this.movementsService.findAll(paginationQuery, token);
    }
    async search(searchDto, paginationQuery, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.search(searchDto, paginationQuery, userSession);
    }
    async getStats(startDate, endDate, token) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        const userSession = token
            ? this.convertTokenToUserSession(token)
            : undefined;
        return this.movementsService.getStats(start, end, userSession);
    }
    async getRecent(limit, token) {
        const limitNumber = limit ? parseInt(limit) : 10;
        const userSession = token
            ? this.convertTokenToUserSession(token)
            : undefined;
        return this.movementsService.getRecentMovements(limitNumber, userSession);
    }
    async findByEmployee(employeeCode, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.findByEmployee(parseInt(employeeCode), userSession);
    }
    async findByIncident(incidentCode, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.findByIncident(incidentCode, userSession);
    }
    async findByDateRange(startDate, endDate, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.findByDateRange(new Date(startDate), new Date(endDate), userSession);
    }
    async findOne(id, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.findOne(id, userSession);
    }
    async create(createMovementDto, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.create(createMovementDto, userSession);
    }
    async update(updateMovementDto, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.update(updateMovementDto, userSession);
    }
    async remove(deleteMovementDto, token) {
        const userSession = this.convertTokenToUserSession(token);
        return this.movementsService.remove(deleteMovementDto.id, userSession);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Obtener lista de movimientos con paginación y búsqueda",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de movimientos obtenida exitosamente",
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto,
        auth_response_dto_1.UserSessionDto]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)("search"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar movimientos con filtros avanzados" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Búsqueda de movimientos realizada exitosamente",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movement_dto_1.MovementSearchDto,
        pagination_dto_1.PaginationQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener estadísticas de movimientos" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Estadísticas de movimientos obtenidas exitosamente",
    }),
    __param(0, (0, common_1.Query)("start_date")),
    __param(1, (0, common_1.Query)("end_date")),
    __param(2, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("recent"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener movimientos recientes" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimientos recientes obtenidos exitosamente",
        type: [movement_dto_1.MovementResponseDto],
    }),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)("employee/:employeeCode"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener movimientos por código de empleado" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimientos obtenidos por empleado",
        type: [movement_dto_1.MovementResponseDto],
    }),
    __param(0, (0, common_1.Param)("employeeCode")),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)("incident/:incidentCode"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener movimientos por código de incidente" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimientos obtenidos por incidente",
        type: [movement_dto_1.MovementResponseDto],
    }),
    __param(0, (0, common_1.Param)("incidentCode")),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "findByIncident", null);
__decorate([
    (0, common_1.Get)("date-range"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener movimientos por rango de fechas" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimientos obtenidos por rango de fechas",
        type: [movement_dto_1.MovementResponseDto],
    }),
    __param(0, (0, common_1.Query)("start_date")),
    __param(1, (0, common_1.Query)("end_date")),
    __param(2, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener un movimiento por ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimiento encontrado",
        type: movement_dto_1.MovementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Movimiento no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear un nuevo movimiento" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Movimiento creado exitosamente",
        type: movement_dto_1.MovementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Datos inválidos o empleado/incidente no existe",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movement_dto_1.CreateMovementDto, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar un movimiento" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimiento actualizado exitosamente",
        type: movement_dto_1.MovementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Movimiento no encontrado" }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Datos inválidos o empleado/incidente no existe",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movement_dto_1.UpdateMovementDto, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar un movimiento" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Movimiento eliminado exitosamente",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Movimiento no encontrado" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.TokenDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movement_dto_1.DeleteMovementDto, Object]),
    __metadata("design:returntype", Promise)
], MovementsController.prototype, "remove", null);
MovementsController = __decorate([
    (0, swagger_1.ApiTags)("Movimientos"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, common_1.Controller)("movements"),
    __metadata("design:paramtypes", [movements_service_1.MovementsService])
], MovementsController);
exports.MovementsController = MovementsController;
//# sourceMappingURL=movements.controller.js.map