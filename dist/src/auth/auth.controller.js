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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const auth_service_1 = require("./auth.service");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, response) {
        const { user, token } = await this.authService.login(loginDto);
        return {
            message: "Login exitoso",
            user,
            token,
        };
    }
    async register(registerDto) {
        const user = await this.authService.register(registerDto);
        return {
            message: "Usuario creado exitosamente",
            user,
        };
    }
    async logout(response) {
        response.cookie("token", "", {
            maxAge: 0,
            path: "/",
        });
        return {
            message: "Logout exitoso",
        };
    }
    async getProfile(request) {
        const authHeader = request.headers.authorization;
        let token = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        else if (request.cookies?.token) {
            token = request.cookies.token;
        }
        if (!token) {
            throw new common_1.UnauthorizedException("Token no encontrado");
        }
        const user = await this.authService.validateToken(token);
        if (!user) {
            throw new common_1.UnauthorizedException("Token inválido o expirado");
        }
        return { user };
    }
    async decodeToken(decodeTokenDto) {
        const { token } = decodeTokenDto;
        if (!token) {
            throw new common_1.UnauthorizedException("Token es requerido");
        }
        return this.authService.decodeToken(token);
    }
};
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Iniciar sesión" }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Login exitoso",
        type: auth_response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Credenciales inválidas",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: "Registrar nuevo usuario" }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Usuario creado exitosamente",
        type: auth_response_dto_1.RegisterResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "El usuario ya existe",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Error interno del servidor",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Cerrar sesión" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Logout exitoso",
        type: auth_response_dto_1.LogoutResponseDto,
    }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener perfil del usuario autenticado" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Perfil del usuario",
        type: auth_response_dto_1.UserSessionDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "No autorizado",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("decode-token"),
    (0, swagger_1.ApiOperation)({ summary: "Decodificar token JWT y mostrar su contenido" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Token decodificado exitosamente",
        type: auth_response_dto_1.DecodeTokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Token inválido o expirado",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_response_dto_1.DecodeTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "decodeToken", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("Autenticación"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map