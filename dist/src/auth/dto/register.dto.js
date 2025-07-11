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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    constructor() {
        this.user_status = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez'
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'juan.perez@ejemplo.com'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener un formato válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El email es requerido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "user_email", void 0);
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
], RegisterDto.prototype, "user_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del usuario (1 = activo, 0 = inactivo)',
        example: 1,
        default: 1
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El estado debe ser un número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RegisterDto.prototype, "user_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)',
        example: 2
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El rol debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El rol es requerido' }),
    __metadata("design:type", Number)
], RegisterDto.prototype, "user_rol", void 0);
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map