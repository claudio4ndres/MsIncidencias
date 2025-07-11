"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const whereCondition = search
                ? [
                    { userName: (0, typeorm_1.Like)(`%${search}%`) },
                    { userEmail: (0, typeorm_1.Like)(`%${search}%`) },
                ]
                : {};
            const [users, total] = await Promise.all([
                this.userRepository.find({
                    where: whereCondition,
                    skip,
                    take: pageSize,
                    order: { createdAt: "DESC" },
                }),
                this.userRepository.count({ where: whereCondition }),
            ]);
            const usersDto = users.map((user) => this.mapToResponseDto(user));
            return new pagination_dto_1.PaginatedResponseDto(usersDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener los usuarios");
        }
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        return this.mapToResponseDto(user);
    }
    async create(createUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { userEmail: createUserDto.user_email },
            });
            if (existingUser) {
                throw new common_1.ConflictException("Ya existe un usuario con este email");
            }
            const hashedPassword = await bcrypt.hash(createUserDto.user_password, 10);
            const savedUser = await this.userRepository.save({
                id: (0, uuid_1.v4)(),
                userName: createUserDto.user_name,
                userEmail: createUserDto.user_email,
                userPassword: hashedPassword,
                userStatus: createUserDto.user_status,
                userRol: createUserDto.user_rol,
            });
            return this.mapToResponseDto(savedUser);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al crear el usuario");
        }
    }
    async update(updateUserDto) {
        const { id, user_password, ...updateData } = updateUserDto;
        await this.findOne(id);
        try {
            if (updateData.user_email) {
                const existingUser = await this.userRepository.findOne({
                    where: { userEmail: updateData.user_email },
                });
                if (existingUser && existingUser.id !== id) {
                    throw new common_1.ConflictException("Ya existe un usuario con este email");
                }
            }
            const updatePayload = {
                userName: updateData.user_name,
                userEmail: updateData.user_email,
                userStatus: updateData.user_status,
                userRol: updateData.user_rol,
            };
            if (user_password) {
                updatePayload.userPassword = await bcrypt.hash(user_password, 10);
            }
            await this.userRepository.update({ id }, updatePayload);
            return await this.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al actualizar el usuario");
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            await this.userRepository.delete({ id });
            return { message: "Usuario eliminado correctamente" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al eliminar el usuario");
        }
    }
    async changePassword(changePasswordDto) {
        const { id, current_password, new_password } = changePasswordDto;
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            if (!user) {
                throw new common_1.NotFoundException("Usuario no encontrado");
            }
            const isCurrentPasswordValid = await bcrypt.compare(current_password, user.userPassword);
            if (!isCurrentPasswordValid) {
                throw new common_1.UnauthorizedException("La contraseña actual es incorrecta");
            }
            const hashedNewPassword = await bcrypt.hash(new_password, 10);
            await this.userRepository.update({ id }, { userPassword: hashedNewPassword });
            return { message: "Contraseña actualizada correctamente" };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al cambiar la contraseña");
        }
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { userEmail: email },
        });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        return this.mapToResponseDto(user);
    }
    async findByRole(role) {
        try {
            const users = await this.userRepository.find({
                where: { userRol: role },
                order: { createdAt: "DESC" },
            });
            return users.map((user) => this.mapToResponseDto(user));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener usuarios por rol");
        }
    }
    async findByStatus(status) {
        try {
            const users = await this.userRepository.find({
                where: { userStatus: status },
                order: { createdAt: "DESC" },
            });
            return users.map((user) => this.mapToResponseDto(user));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener usuarios por estado");
        }
    }
    async getStats() {
        try {
            const [total, active, inactive, admins, technicians, users] = await Promise.all([
                this.userRepository.count(),
                this.userRepository.count({ where: { userStatus: 1 } }),
                this.userRepository.count({ where: { userStatus: 0 } }),
                this.userRepository.count({ where: { userRol: 1 } }),
                this.userRepository.count({ where: { userRol: 3 } }),
                this.userRepository.count({ where: { userRol: 2 } }),
            ]);
            return {
                total,
                byStatus: { active, inactive },
                byRole: { admins, technicians, users },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener estadísticas de usuarios");
        }
    }
    mapToResponseDto(user) {
        return {
            id: user.id,
            company_id: null,
            office_id: null,
            user_name: user.userName,
            user_email: user.userEmail,
            user_status: user.userStatus,
            user_rol: user.userRol,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.UserRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map