import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/_common/decorators";
import { Role } from "@src/_common/enums";
import { TokenGuard } from "@src/_common/guards";
import { RolesGuard } from "@src/_common/guards/roles.guard";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import {
  ChangePasswordDto,
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "./dto/user.dto";
import { UsersService } from "./users.service";

@ApiTags("Usuarios")
@Controller("users")
@UseGuards(TokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.GERENTE)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener lista de usuarios con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios obtenida exitosamente",
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get("stats")
  @ApiOperation({ summary: "Obtener estadísticas de usuarios" })
  @ApiResponse({
    status: 200,
    description: "Estadísticas de usuarios obtenidas exitosamente",
  })
  async getStats(): Promise<any> {
    return this.usersService.getStats();
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Obtener usuario por email" })
  @ApiResponse({
    status: 200,
    description: "Usuario encontrado",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async findByEmail(@Param("email") email: string): Promise<UserResponseDto> {
    return this.usersService.findByEmail(email);
  }

  @Get("role/:role")
  @ApiOperation({ summary: "Obtener usuarios por rol" })
  @ApiResponse({
    status: 200,
    description: "Usuarios obtenidos por rol",
    type: [UserResponseDto],
  })
  async findByRole(@Param("role") role: string): Promise<UserResponseDto[]> {
    return this.usersService.findByRole(parseInt(role));
  }

  @Get("status/:status")
  @ApiOperation({ summary: "Obtener usuarios por estado" })
  @ApiResponse({
    status: 200,
    description: "Usuarios obtenidos por estado",
    type: [UserResponseDto],
  })
  async findByStatus(
    @Param("status") status: string
  ): Promise<UserResponseDto[]> {
    return this.usersService.findByStatus(parseInt(status));
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiResponse({
    status: 200,
    description: "Usuario encontrado",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async findOne(@Param("id") id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({
    status: 201,
    description: "Usuario creado exitosamente",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({
    status: 409,
    description: "Ya existe un usuario con este email",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Put()
  @ApiOperation({ summary: "Actualizar un usuario" })
  @ApiResponse({
    status: 200,
    description: "Usuario actualizado exitosamente",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  @ApiResponse({
    status: 409,
    description: "Ya existe un usuario con este email",
  })
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.update(updateUserDto);
  }

  @Put("change-password")
  @ApiOperation({ summary: "Cambiar contraseña de usuario" })
  @ApiResponse({
    status: 200,
    description: "Contraseña actualizada correctamente",
  })
  @ApiResponse({
    status: 401,
    description: "La contraseña actual es incorrecta",
  })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(changePasswordDto);
  }

  @Delete()
  @ApiOperation({ summary: "Eliminar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario eliminado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async remove(
    @Body() deleteUserDto: DeleteUserDto
  ): Promise<{ message: string }> {
    return this.usersService.remove(deleteUserDto.id);
  }
}
