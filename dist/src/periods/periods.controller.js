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
exports.PeriodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const periods_service_1 = require("./periods.service");
const periods_dto_1 = require("./dto/periods.dto");
let PeriodsController = class PeriodsController {
    constructor(periodsService) {
        this.periodsService = periodsService;
    }
    async findAll() {
        return this.periodsService.findAll();
    }
    async getMovementsByPeriod(period) {
        return await this.periodsService.findMovementsByPeriod(period);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los períodos de nómina con información de semana' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Períodos obtenidos exitosamente',
        type: [periods_dto_1.PeriodResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PeriodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filter/:period/movements'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por período' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Movimientos del período obtenidos exitosamente',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Período no encontrado' }),
    __param(0, (0, common_1.Param)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PeriodsController.prototype, "getMovementsByPeriod", null);
PeriodsController = __decorate([
    (0, common_1.Controller)('periods'),
    (0, swagger_1.ApiTags)('Periods - Períodos de Nómina'),
    __metadata("design:paramtypes", [periods_service_1.PeriodsService])
], PeriodsController);
exports.PeriodsController = PeriodsController;
//# sourceMappingURL=periods.controller.js.map