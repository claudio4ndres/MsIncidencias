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
exports.DecodeTokenResponseDto = exports.DecodeTokenDto = exports.LogoutResponseDto = exports.RegisterResponseDto = exports.LoginResponseDto = exports.UserSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserSessionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario',
        example: 'user-123'
    }),
    __metadata("design:type", String)
], UserSessionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Juan Pérez'
    }),
    __metadata("design:type", String)
], UserSessionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'juan.perez@ejemplo.com'
    }),
    __metadata("design:type", String)
], UserSessionDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario',
        example: 2
    }),
    __metadata("design:type", Number)
], UserSessionDto.prototype, "role", void 0);
exports.UserSessionDto = UserSessionDto;
class LoginResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de respuesta',
        example: 'Login exitoso'
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de sesión del usuario',
        type: UserSessionDto
    }),
    __metadata("design:type", UserSessionDto)
], LoginResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Acceso token JWT',
        type: 'string',
        example: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "token", void 0);
exports.LoginResponseDto = LoginResponseDto;
class RegisterResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de respuesta',
        example: 'Usuario creado exitosamente'
    }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos del usuario creado',
        type: UserSessionDto
    }),
    __metadata("design:type", UserSessionDto)
], RegisterResponseDto.prototype, "user", void 0);
exports.RegisterResponseDto = RegisterResponseDto;
class LogoutResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de respuesta',
        example: 'Logout exitoso'
    }),
    __metadata("design:type", String)
], LogoutResponseDto.prototype, "message", void 0);
exports.LogoutResponseDto = LogoutResponseDto;
class DecodeTokenDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token JWT a decodificar',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    __metadata("design:type", String)
], DecodeTokenDto.prototype, "token", void 0);
exports.DecodeTokenDto = DecodeTokenDto;
class DecodeTokenResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el token es válido',
        example: true
    }),
    __metadata("design:type", Boolean)
], DecodeTokenResponseDto.prototype, "valid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payload del token JWT',
        example: {
            id: 'user-123',
            name: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            role: 2,
            iat: 1641024000,
            exp: 1641110400
        }
    }),
    __metadata("design:type", Object)
], DecodeTokenResponseDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información actualizada del usuario desde la base de datos',
        type: UserSessionDto,
        nullable: true
    }),
    __metadata("design:type", UserSessionDto)
], DecodeTokenResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información cruda del token decodificado',
        example: {
            id: 'user-123',
            name: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            role: 2,
            iat: 1641024000,
            exp: 1641110400
        }
    }),
    __metadata("design:type", Object)
], DecodeTokenResponseDto.prototype, "decoded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información adicional sobre el token',
        example: {
            issued_at: '2022-01-01T12:00:00.000Z',
            expires_at: '2022-01-02T12:00:00.000Z',
            is_expired: false
        }
    }),
    __metadata("design:type", Object)
], DecodeTokenResponseDto.prototype, "tokenInfo", void 0);
exports.DecodeTokenResponseDto = DecodeTokenResponseDto;
//# sourceMappingURL=auth-response.dto.js.map