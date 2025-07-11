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
exports.DeleteCompanyDto = exports.CompanyResponseDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCompanyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la compañía',
        example: 'Televisión Mexicana S.A.'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre de la compañía debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la compañía es requerido' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la compañía (1 = activo, 0 = inactivo)',
        example: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado es requerido' }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "company_status", void 0);
exports.CreateCompanyDto = CreateCompanyDto;
class UpdateCompanyDto extends (0, swagger_1.PartialType)(CreateCompanyDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la compañía',
        example: 'comp-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "id", void 0);
exports.UpdateCompanyDto = UpdateCompanyDto;
class CompanyResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la compañía',
        example: 'comp-123'
    }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la compañía',
        example: 'Televisión Mexicana S.A.'
    }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la compañía',
        example: 1
    }),
    __metadata("design:type", Number)
], CompanyResponseDto.prototype, "company_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], CompanyResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de actualización',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], CompanyResponseDto.prototype, "updated_at", void 0);
exports.CompanyResponseDto = CompanyResponseDto;
class DeleteCompanyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la compañía a eliminar',
        example: 'comp-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], DeleteCompanyDto.prototype, "id", void 0);
exports.DeleteCompanyDto = DeleteCompanyDto;
//# sourceMappingURL=company.dto.js.map