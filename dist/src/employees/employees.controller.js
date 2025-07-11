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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const employee_dto_1 = require("./dto/employee.dto");
const employees_service_1 = require("./employees.service");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async findAll(paginationQuery) {
        return this.employeesService.findAll(paginationQuery);
    }
    async findOne(id) {
        return this.employeesService.findOne(id);
    }
    async create(createEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }
    async update(updateEmployeeDto) {
        return this.employeesService.update(updateEmployeeDto);
    }
    async remove(deleteEmployeeDto) {
        return this.employeesService.remove(deleteEmployeeDto.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Obtener lista de empleados con paginación y búsqueda",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de empleados obtenida exitosamente",
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener un empleado por ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Empleado encontrado",
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Empleado no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear un nuevo empleado" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Empleado creado exitosamente",
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar un empleado" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Empleado actualizado exitosamente",
        type: employee_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Empleado no encontrado" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar un empleado" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Empleado eliminado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Empleado no encontrado" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.DeleteEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "remove", null);
EmployeesController = __decorate([
    (0, swagger_1.ApiTags)("Empleados"),
    (0, common_1.Controller)("employees"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
exports.EmployeesController = EmployeesController;
//# sourceMappingURL=employees.controller.js.map