import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { UserRepository } from "../_common/repository";
import { UserEntity } from "../_common/repository/entities/user.entity";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "./dto/user.dto";
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition = search
        ? [
            { userName: Like(`%${search}%`) },
            { userEmail: Like(`%${search}%`) },
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
      return new PaginatedResponseDto(usersDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los usuarios");
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Verificar que no exista un usuario con el mismo email
      const existingUser = await this.userRepository.findOne({
        where: { userEmail: createUserDto.user_email },
      });

      if (existingUser) {
        throw new ConflictException("Ya existe un usuario con este email");
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.user_password, 10);

      const savedUser = await this.userRepository.save({
        id: uuidv4(),
        userName: createUserDto.user_name,
        userEmail: createUserDto.user_email,
        userPassword: hashedPassword,
        userStatus: createUserDto.user_status,
        userRol: createUserDto.user_rol,
      });

      return this.mapToResponseDto(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error al crear el usuario");
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const { id, user_password, ...updateData } = updateUserDto;

    // Verificar que el usuario existe
    await this.findOne(id);

    try {
      // Si se actualiza el email, verificar que no exista otro usuario con el mismo email
      if (updateData.user_email) {
        const existingUser = await this.userRepository.findOne({
          where: { userEmail: updateData.user_email },
        });

        if (existingUser && existingUser.id !== id) {
          throw new ConflictException("Ya existe un usuario con este email");
        }
      }

      const updatePayload: any = {
        userName: updateData.user_name,
        userEmail: updateData.user_email,
        userStatus: updateData.user_status,
        userRol: updateData.user_rol,
      };

      // Si se proporciona nueva contraseña, hashearla
      if (user_password) {
        updatePayload.userPassword = await bcrypt.hash(user_password, 10);
      }

      await this.userRepository.update({ id }, updatePayload);

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error al actualizar el usuario");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verificar que el usuario exists
    await this.findOne(id);

    try {
      await this.userRepository.delete({ id });
      return { message: "Usuario eliminado correctamente" };
    } catch (error) {
      throw new InternalServerErrorException("Error al eliminar el usuario");
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    const { id, current_password, new_password } = changePasswordDto;

    try {
      // Obtener usuario con contraseña
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(
        current_password,
        user.userPassword
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException("La contraseña actual es incorrecta");
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Actualizar contraseña
      await this.userRepository.update(
        { id },
        { userPassword: hashedNewPassword }
      );

      return { message: "Contraseña actualizada correctamente" };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error al cambiar la contraseña");
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { userEmail: email },
    });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return this.mapToResponseDto(user);
  }

  async findByRole(role: number): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find({
        where: { userRol: role },
        order: { createdAt: "DESC" },
      });
      return users.map((user) => this.mapToResponseDto(user));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener usuarios por rol"
      );
    }
  }

  async findByStatus(status: number): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find({
        where: { userStatus: status },
        order: { createdAt: "DESC" },
      });
      return users.map((user) => this.mapToResponseDto(user));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener usuarios por estado"
      );
    }
  }

  async getStats(): Promise<any> {
    try {
      const [total, active, inactive, admins, technicians, users] =
        await Promise.all([
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener estadísticas de usuarios"
      );
    }
  }

  private mapToResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      company_id: null, // No longer available
      office_id: null, // No longer available
      user_name: user.userName,
      user_email: user.userEmail,
      user_status: user.userStatus,
      user_rol: user.userRol,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
