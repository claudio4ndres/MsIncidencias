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
exports.OfficesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const office_dto_1 = require("./dto/office.dto");
const offices_service_1 = require("./offices.service");
let OfficesController = class OfficesController {
    constructor(officesService) {
        this.officesService = officesService;
    }
    async findAll(paginationQuery) {
        return this.officesService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.officesService.findOne(id);
    }
    async create(createOfficeDto) {
        return this.officesService.create(createOfficeDto);
    }
    async update(updateOfficeDto) {
        return this.officesService.update(updateOfficeDto);
    }
    async remove(deleteOfficeDto) {
        return this.officesService.remove(deleteOfficeDto.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener lista de oficinas" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], OfficesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener una oficina por ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OfficesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear una nueva oficina" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [office_dto_1.CreateOfficeDto]),
    __metadata("design:returntype", Promise)
], OfficesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar una oficina" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [office_dto_1.UpdateOfficeDto]),
    __metadata("design:returntype", Promise)
], OfficesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar una oficina" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [office_dto_1.DeleteOfficeDto]),
    __metadata("design:returntype", Promise)
], OfficesController.prototype, "remove", null);
OfficesController = __decorate([
    (0, swagger_1.ApiTags)("Oficinas"),
    (0, common_1.Controller)("offices"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [offices_service_1.OfficesService])
], OfficesController);
exports.OfficesController = OfficesController;
//# sourceMappingURL=offices.controller.js.map