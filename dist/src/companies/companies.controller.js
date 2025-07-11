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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const companies_service_1 = require("./companies.service");
const company_dto_1 = require("./dto/company.dto");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findAll(paginationQuery) {
        return this.companiesService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.companiesService.findOne(id);
    }
    async create(createCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }
    async update(updateCompanyDto) {
        return this.companiesService.update(updateCompanyDto);
    }
    async remove(deleteCompanyDto) {
        return this.companiesService.remove(deleteCompanyDto.id);
    }
    async findByStatus(status) {
        return this.companiesService.findByStatus(parseInt(status));
    }
    async findWithOffices(id) {
        return this.companiesService.findWithOffices(id);
    }
    async findWithUsers(id) {
        return this.companiesService.findWithUsers(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Obtener lista de compañías con paginación y búsqueda",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de compañías obtenida exitosamente",
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener una compañía por ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Compañía encontrada",
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Compañía no encontrada" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear una nueva compañía" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Compañía creada exitosamente",
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar una compañía" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Compañía actualizada exitosamente",
        type: company_dto_1.CompanyResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Compañía no encontrada" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar una compañía" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Compañía eliminada exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Compañía no encontrada" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.DeleteCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("status/:status"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener compañías por estado" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Compañías obtenidas por estado" }),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(":id/offices"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener compañía con sus oficinas" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Compañía con oficinas obtenida" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findWithOffices", null);
__decorate([
    (0, common_1.Get)(":id/users"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener compañía con sus usuarios" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Compañía con usuarios obtenida" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findWithUsers", null);
CompaniesController = __decorate([
    (0, swagger_1.ApiTags)("Compañías"),
    (0, common_1.Controller)("companies"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
exports.CompaniesController = CompaniesController;
//# sourceMappingURL=companies.controller.js.map