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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../_common/guards");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const user_dto_1 = require("./dto/user.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(paginationQuery) {
        return this.usersService.findAll(paginationQuery);
    }
    async getStats() {
        return this.usersService.getStats();
    }
    async findByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    async findByRole(role) {
        return this.usersService.findByRole(parseInt(role));
    }
    async findByStatus(status) {
        return this.usersService.findByStatus(parseInt(status));
    }
    async findOne(id) {
        return this.usersService.findOne(id);
    }
    async create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async update(updateUserDto) {
        return this.usersService.update(updateUserDto);
    }
    async changePassword(changePasswordDto) {
        return this.usersService.changePassword(changePasswordDto);
    }
    async remove(deleteUserDto) {
        return this.usersService.remove(deleteUserDto.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Obtener lista de usuarios con paginación y búsqueda",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de usuarios obtenida exitosamente",
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener estadísticas de usuarios" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Estadísticas de usuarios obtenidas exitosamente",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("email/:email"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener usuario por email" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Usuario encontrado",
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)("role/:role"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener usuarios por rol" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Usuarios obtenidos por rol",
        type: [user_dto_1.UserResponseDto],
    }),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)("status/:status"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener usuarios por estado" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Usuarios obtenidos por estado",
        type: [user_dto_1.UserResponseDto],
    }),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener un usuario por ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Usuario encontrado",
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear un nuevo usuario" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Usuario creado exitosamente",
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Ya existe un usuario con este email",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar un usuario" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Usuario actualizado exitosamente",
        type: user_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Ya existe un usuario con este email",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("change-password"),
    (0, swagger_1.ApiOperation)({ summary: "Cambiar contraseña de usuario" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Contraseña actualizada correctamente",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "La contraseña actual es incorrecta",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar un usuario" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Usuario eliminado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("Usuarios"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map