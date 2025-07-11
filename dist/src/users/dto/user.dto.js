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
exports.ChangePasswordDto = exports.DeleteUserDto = exports.UserResponseDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
    constructor() {
        this.user_status = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez González'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'juan.perez@empresa.com'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener un formato válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El email es requerido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "user_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario',
        example: 'miContraseña123',
        minLength: 6
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "user_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del usuario (1 = activo, 0 = inactivo)',
        example: 1,
        default: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "user_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)',
        example: 2
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El rol debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El rol es requerido' }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "user_rol", void 0);
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(CreateUserDto, ['user_password'])) {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario',
        example: 'user-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nueva contraseña del usuario (opcional)',
        example: 'nuevaContraseña123',
        minLength: 6,
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "user_password", void 0);
exports.UpdateUserDto = UpdateUserDto;
class UserResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario',
        example: 'user-123'
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la compañía (ya no disponible)',
        example: null,
        nullable: true
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la oficina (ya no disponible)',
        example: null,
        nullable: true
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "office_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Juan Pérez González'
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'juan.perez@empresa.com'
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "user_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del usuario',
        example: 1
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "user_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario',
        example: 2
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "user_rol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de actualización',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updated_at", void 0);
exports.UserResponseDto = UserResponseDto;
class DeleteUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario a eliminar',
        example: 'user-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], DeleteUserDto.prototype, "id", void 0);
exports.DeleteUserDto = DeleteUserDto;
class ChangePasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario',
        example: 'user-123'
    }),
    (0, class_validator_1.IsString)({ message: 'El ID debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es requerido' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña actual',
        example: 'contraseñaActual123'
    }),
    (0, class_validator_1.IsString)({ message: 'La contraseña actual debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña actual es requerida' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "current_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nueva contraseña',
        example: 'nuevaContraseña123',
        minLength: 6
    }),
    (0, class_validator_1.IsString)({ message: 'La nueva contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La nueva contraseña es requerida' }),
    (0, class_validator_1.MinLength)(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
//# sourceMappingURL=user.dto.js.map