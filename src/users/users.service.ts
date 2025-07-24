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
import { UserAccessRepository } from "../_common/repository/user-access.repository";
import { UserEntity } from "../_common/repository/entities/user.entity";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "./dto/user.dto";
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccessRepository: UserAccessRepository
  ) {}

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
          relations: ['userAccess', 'userAccess.company', 'userAccess.office'],
        }),
        this.userRepository.count({ where: whereCondition }),
      ]);
      console.log("Fetching users:", users);
      const usersDto = users.map((user) => this.mapToResponseDto(user));
      return new PaginatedResponseDto(usersDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los usuarios");
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userAccess', 'userAccess.company', 'userAccess.office'],
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
    const { id, user_password, company_id, office_id, ...updateData } = updateUserDto;

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

      // Actualizar datos del usuario
      await this.userRepository.update({ id }, updatePayload);

      // Manejar actualización de user_access si se proporcionan company_id u office_id
      if (company_id || office_id) {
        await this.updateUserAccess(id, company_id, office_id);
      }

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

  /**
   * Actualiza o crea un registro en user_access para el usuario
   */
  private async updateUserAccess(
    userId: string,
    companyId?: string,
    officeId?: string
  ): Promise<void> {
    try {
      // Obtener accesos actuales del usuario
      const currentAccesses = await this.userAccessRepository.findByUserId(userId);
      
      // Si ambos parámetros están presentes, buscar o crear el acceso específico
      if (companyId && officeId) {
        const existingAccess = currentAccesses.find(
          access => access.companyId === companyId && access.officeId === officeId
        );
        
        if (!existingAccess) {
          // Crear nuevo acceso
          await this.userAccessRepository.save({
            userId,
            companyId,
            officeId,
            status: 1,
          });
        }
        // Si ya existe, no necesita actualización
        return;
      }
      
      // Si solo se proporciona company_id, actualizar todos los accesos del usuario
      if (companyId) {
        for (const access of currentAccesses) {
          await this.userAccessRepository.save({
            ...access,
            companyId,
          });
        }
        return;
      }
      
      // Si solo se proporciona office_id, actualizar todos los accesos del usuario
      if (officeId) {
        for (const access of currentAccesses) {
          await this.userAccessRepository.save({
            ...access,
            officeId,
          });
        }
        return;
      }
    } catch (error) {
      console.error('Error updating user access:', error);
      throw new InternalServerErrorException('Error al actualizar el acceso del usuario');
    }
  }

  private mapToResponseDto(user: UserEntity): UserResponseDto {
    // Obtener el primer acceso activo del usuario (si existe)
    const activeAccess = user.userAccess?.find(access => access.status === 1);
    
    return {
      id: user.id,
      //company_id: activeAccess?.companyId || null,
      //office_id: activeAccess?.officeId || null,
      user_name: user.userName,
      user_email: user.userEmail,
      user_status: user.userStatus,
      user_rol: user.userRol,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      // Información adicional de acceso (opcional)
      user_access: user.userAccess?.map(access => ({
        id: access.id,
        company_id: access.companyId,
        office_id: access.officeId,
        company_name: access.company?.companyName,
        office_name: access.office?.officeName,
        status: access.status,
      })) || [],
    };
  }
}
