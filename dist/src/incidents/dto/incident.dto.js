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
exports.DeleteIncidentDto = exports.IncidentResponseDto = exports.UpdateIncidentDto = exports.CreateIncidentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateIncidentDto {
    constructor() {
        this.incident_status = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código único del incidente',
        example: 'INC-001'
    }),
    (0, class_validator_1.IsString)({ message: 'El código del incidente debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El código del incidente es requerido' }),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "incident_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del incidente',
        example: 'Falla en servidor principal'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre del incidente debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del incidente es requerido' }),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "incident_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del incidente (1 = activo, 0 = inactivo)',
        example: 1,
        default: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateIncidentDto.prototype, "incident_status", void 0);
exports.CreateIncidentDto = CreateIncidentDto;
class UpdateIncidentDto extends (0, swagger_1.PartialType)(CreateIncidentDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del incidente',
        example: 'incident-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "id", void 0);
exports.UpdateIncidentDto = UpdateIncidentDto;
class IncidentResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del incidente',
        example: 'incident-123'
    }),
    __metadata("design:type", String)
], IncidentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del incidente',
        example: 'INC-001'
    }),
    __metadata("design:type", String)
], IncidentResponseDto.prototype, "incident_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del incidente',
        example: 'Falla en servidor principal'
    }),
    __metadata("design:type", String)
], IncidentResponseDto.prototype, "incident_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del incidente',
        example: 1
    }),
    __metadata("design:type", Number)
], IncidentResponseDto.prototype, "incident_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], IncidentResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de actualización',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], IncidentResponseDto.prototype, "updated_at", void 0);
exports.IncidentResponseDto = IncidentResponseDto;
class DeleteIncidentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del incidente a eliminar',
        example: 'incident-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], DeleteIncidentDto.prototype, "id", void 0);
exports.DeleteIncidentDto = DeleteIncidentDto;
//# sourceMappingURL=incident.dto.js.map