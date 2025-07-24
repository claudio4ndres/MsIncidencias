import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserAccessRepository, UserRepository } from "../_common/repository";
import { UserSessionDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    // Use the correct repository for user access, e.g., UserAccessRepository
    private readonly userAccessRepository: UserAccessRepository
  ) {}

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    // Buscar usuario activo por email
    const user = await this.userRepository.findOne({
      where: {
        userEmail: email,
        userStatus: 1, // Usuario activo
      },
    });
    //console.log("user", user);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Crear sesión del usuario
    const userSession: UserSessionDto = {
      id: user.id,
      name: user.userName,
      email: user.userEmail,
      role: user.userRol,
    };

    // Generar JWT
    const token = this.jwtService.sign(userSession);

    return { token };
  }

  async register(registerDto: RegisterDto): Promise<UserSessionDto> {
    const {
      user_name,
      user_email,
      user_password,
      user_status = 1,
      user_rol,
    } = registerDto;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({
        where: { userEmail: user_email },
      });

      if (existingUser) {
        throw new ConflictException("El usuario ya existe");
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(user_password, 10);
      const id = uuidv4();
      // Crear usuario
      const newUser = await this.userRepository.save({
        id: id,
        userName: user_name,
        userEmail: user_email,
        userPassword: hashedPassword,
        userStatus: user_status,
        userRol: user_rol,
        updatedAt: new Date(Date.now()),
      });
      // Save user access information using the correct repository and entity
      const user_access = await this.userAccessRepository.save({
        userId: id,
        companyId: registerDto.company_id,
        officeId: registerDto.office_id,
        updatedAt: new Date(Date.now()),
      });

      if (!newUser || !user_access) {
        throw new InternalServerErrorException("Error al crear el usuario");
      }

      // Retornar datos del usuario (sin contraseña)
      return {
        id: newUser.id,
        name: newUser.userName,
        email: newUser.userEmail,
        role: newUser.userRol,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error interno del servidor");
    }
  }

  async validateToken(token: string): Promise<UserSessionDto | null> {
    try {
      const payload = this.jwtService.verify(token);

      // Obtener información actualizada del usuario desde la base de datos
      const user = await this.userRepository.findOne({
        where: {
          id: payload.id,
          userStatus: 1, // Solo usuarios activos
        },
      });

      if (!user) {
        return null;
      }

      // Retornar información actualizada del usuario
      return {
        id: user.id,
        name: user.userName,
        email: user.userEmail,
        role: user.userRol,
      };
    } catch (error) {
      return null;
    }
  }

  async getProfile(userId: string): Promise<UserSessionDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return {
      id: user.id,
      name: user.userName,
      email: user.userEmail,
      role: user.userRol,
    };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      // Decodificar el token sin verificar (para mostrar contenido)
      const decoded = this.jwtService.decode(token) as any;

      // Verificar si el token es válido
      let isValid = false;
      let payload = null;
      let user = null;

      try {
        payload = this.jwtService.verify(token);
        isValid = true;

        // Obtener información actualizada del usuario
        const userFromDb = await this.userRepository.findOne({
          where: {
            id: payload.id,
            userStatus: 1,
          },
        });

        if (userFromDb) {
          user = {
            id: userFromDb.id,
            name: userFromDb.userName,
            email: userFromDb.userEmail,
            role: userFromDb.userRol,
          };
        }
      } catch (error) {
        isValid = false;
      }

      return {
        valid: isValid,
        payload: payload || decoded,
        user: user,
        decoded: decoded, // Información cruda del token
        tokenInfo: {
          issued_at: decoded?.iat
            ? new Date(decoded.iat * 1000).toISOString()
            : null,
          expires_at: decoded?.exp
            ? new Date(decoded.exp * 1000).toISOString()
            : null,
          is_expired: decoded?.exp ? decoded.exp < Date.now() / 1000 : null,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Token inválido o mal formado");
    }
  }
}
