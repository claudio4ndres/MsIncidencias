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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
const employee_mapper_1 = require("./mappers/employee.mapper");
let EmployeesService = class EmployeesService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const whereCondition = search
                ? [
                    { employeeName: (0, typeorm_1.Like)(`%${search}%`) },
                    { employeeType: (0, typeorm_1.Like)(`%${search}%`) },
                ]
                : {};
            const [employees, total] = await Promise.all([
                this.employeeRepository.find({
                    where: whereCondition,
                    skip,
                    take: pageSize,
                    order: { createdAt: "DESC" },
                    relations: ["office"],
                }),
                this.employeeRepository.count({ where: whereCondition }),
            ]);
            const employeesDto = employee_mapper_1.EmployeeMapper.toResponseDtoArray(employees);
            return new pagination_dto_1.PaginatedResponseDto(employeesDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener los empleados");
        }
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ["office"],
        });
        if (!employee) {
            throw new common_1.NotFoundException("Empleado no encontrado");
        }
        return employee_mapper_1.EmployeeMapper.toResponseDto(employee);
    }
    async create(createEmployeeDto) {
        try {
            const savedEmployee = await this.employeeRepository.save({
                id: (0, uuid_1.v4)(),
                officeId: createEmployeeDto.office_id,
                employeeCode: createEmployeeDto.employee_code,
                employeeName: createEmployeeDto.employee_name,
                employeeType: createEmployeeDto.employee_type,
                employeeStatus: createEmployeeDto.employee_status,
                updatedAt: new Date(),
            });
            return employee_mapper_1.EmployeeMapper.toResponseDto(savedEmployee);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al crear el empleado");
        }
    }
    async update(updateEmployeeDto) {
        const { id, ...updateData } = updateEmployeeDto;
        await this.findOne(id);
        try {
            await this.employeeRepository.update({ id }, {
                officeId: updateData.office_id,
                employeeCode: updateData.employee_code,
                employeeName: updateData.employee_name,
                employeeType: updateData.employee_type,
                employeeStatus: updateData.employee_status,
            });
            return await this.findOne(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al actualizar el empleado");
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            await this.employeeRepository.delete({ id });
            return { message: "Empleado eliminado correctamente" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al eliminar el empleado");
        }
    }
};
EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.EmployeeRepository])
], EmployeesService);
exports.EmployeesService = EmployeesService;
//# sourceMappingURL=employees.service.js.map