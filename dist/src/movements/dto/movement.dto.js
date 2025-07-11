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
exports.MovementSearchDto = exports.DeleteMovementDto = exports.MovementResponseDto = exports.UpdateMovementDto = exports.CreateMovementDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateMovementDto {
    constructor() {
        this.incidence_status = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del empleado',
        example: 12345
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El código del empleado debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El código del empleado es requerido' }),
    __metadata("design:type", Number)
], CreateMovementDto.prototype, "employee_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del incidente',
        example: 'INC-001'
    }),
    (0, class_validator_1.IsString)({ message: 'El código del incidente debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El código del incidente es requerido' }),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "incident_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de la incidencia',
        example: '2024-01-01T12:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de incidencia debe ser una fecha válida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de incidencia es requerida' }),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "incidence_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Observaciones de la incidencia',
        example: 'El empleado llegó tarde debido a problemas de transporte'
    }),
    (0, class_validator_1.IsString)({ message: 'Las observaciones deben ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Las observaciones son requeridas' }),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "incidence_observation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la incidencia (1 = activo, 0 = inactivo)',
        example: 1,
        default: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMovementDto.prototype, "incidence_status", void 0);
exports.CreateMovementDto = CreateMovementDto;
class UpdateMovementDto extends (0, swagger_1.PartialType)(CreateMovementDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del movimiento',
        example: 'movement-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], UpdateMovementDto.prototype, "id", void 0);
exports.UpdateMovementDto = UpdateMovementDto;
class MovementResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del movimiento',
        example: 'movement-123'
    }),
    __metadata("design:type", String)
], MovementResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del empleado',
        example: 12345
    }),
    __metadata("design:type", Number)
], MovementResponseDto.prototype, "employee_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del incidente',
        example: 'INC-001'
    }),
    __metadata("design:type", String)
], MovementResponseDto.prototype, "incident_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de la incidencia',
        example: '2024-01-01T12:00:00.000Z'
    }),
    __metadata("design:type", Date)
], MovementResponseDto.prototype, "incidence_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Observaciones de la incidencia',
        example: 'El empleado llegó tarde debido a problemas de transporte'
    }),
    __metadata("design:type", String)
], MovementResponseDto.prototype, "incidence_observation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la incidencia',
        example: 1
    }),
    __metadata("design:type", Number)
], MovementResponseDto.prototype, "incidence_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], MovementResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de actualización',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], MovementResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información del empleado asociado',
        required: false
    }),
    __metadata("design:type", Object)
], MovementResponseDto.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información del incidente asociado',
        required: false
    }),
    __metadata("design:type", Object)
], MovementResponseDto.prototype, "incident", void 0);
exports.MovementResponseDto = MovementResponseDto;
class DeleteMovementDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del movimiento a eliminar',
        example: 'movement-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], DeleteMovementDto.prototype, "id", void 0);
exports.DeleteMovementDto = DeleteMovementDto;
class MovementSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del empleado para filtrar',
        example: 12345,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'El código del empleado debe ser un número' }),
    __metadata("design:type", Number)
], MovementSearchDto.prototype, "employee_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código del incidente para filtrar',
        example: 'INC-001',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código del incidente debe ser una cadena de texto' }),
    __metadata("design:type", String)
], MovementSearchDto.prototype, "incident_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la incidencia para filtrar',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    __metadata("design:type", Number)
], MovementSearchDto.prototype, "incidence_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de inicio para filtrar por rango (YYYY-MM-DD)',
        example: '2024-01-01',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de inicio debe ser una fecha válida' }),
    __metadata("design:type", String)
], MovementSearchDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de fin para filtrar por rango (YYYY-MM-DD)',
        example: '2024-01-31',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de fin debe ser una fecha válida' }),
    __metadata("design:type", String)
], MovementSearchDto.prototype, "end_date", void 0);
exports.MovementSearchDto = MovementSearchDto;
//# sourceMappingURL=movement.dto.js.map