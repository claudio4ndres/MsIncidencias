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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const repository_1 = require("../_common/repository");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: {
                userEmail: email,
                userStatus: 1,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        const isPasswordValid = await bcrypt.compare(password, user.userPassword);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        const userSession = {
            id: user.id,
            name: user.userName,
            email: user.userEmail,
            role: user.userRol,
        };
        const token = this.jwtService.sign(userSession);
        return { user: userSession, token };
    }
    async register(registerDto) {
        const { user_name, user_email, user_password, user_status = 1, user_rol, } = registerDto;
        try {
            const existingUser = await this.userRepository.findOne({
                where: { userEmail: user_email },
            });
            if (existingUser) {
                throw new common_1.ConflictException("El usuario ya existe");
            }
            const hashedPassword = await bcrypt.hash(user_password, 10);
            const newUser = await this.userRepository.save({
                userName: user_name,
                userEmail: user_email,
                userPassword: hashedPassword,
                userStatus: user_status,
                userRol: user_rol,
            });
            return {
                id: newUser.id,
                name: newUser.userName,
                email: newUser.userEmail,
                role: newUser.userRol,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error interno del servidor");
        }
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: {
                    id: payload.id,
                    userStatus: 1
                }
            });
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                name: user.userName,
                email: user.userEmail,
                role: user.userRol,
            };
        }
        catch (error) {
            return null;
        }
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        return {
            id: user.id,
            name: user.userName,
            email: user.userEmail,
            role: user.userRol,
        };
    }
    async decodeToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            let isValid = false;
            let payload = null;
            let user = null;
            try {
                payload = this.jwtService.verify(token);
                isValid = true;
                const userFromDb = await this.userRepository.findOne({
                    where: {
                        id: payload.id,
                        userStatus: 1
                    }
                });
                if (userFromDb) {
                    user = {
                        id: userFromDb.id,
                        name: userFromDb.userName,
                        email: userFromDb.userEmail,
                        role: userFromDb.userRol,
                    };
                }
            }
            catch (error) {
                isValid = false;
            }
            return {
                valid: isValid,
                payload: payload || decoded,
                user: user,
                decoded: decoded,
                tokenInfo: {
                    issued_at: decoded?.iat ? new Date(decoded.iat * 1000).toISOString() : null,
                    expires_at: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
                    is_expired: decoded?.exp ? decoded.exp < Date.now() / 1000 : null,
                }
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Token inválido o mal formado");
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.UserRepository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map