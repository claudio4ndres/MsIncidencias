import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González'
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  user_name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@empresa.com'
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  user_email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miContraseña123',
    minLength: 6
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  user_password: string;

  @ApiProperty({
    description: 'Estado del usuario (1 = activo, 0 = inactivo)',
    example: 1,
    default: 1
  })
  @IsNumber({}, { message: 'El estado debe ser un número' })
  @IsOptional()
  user_status?: number = 1;

  @ApiProperty({
    description: 'Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)',
    example: 2
  })
  @IsNumber({}, { message: 'El rol debe ser un número' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  user_rol: number;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['user_password'] as const)) {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario (opcional)',
    example: 'nuevaContraseña123',
    minLength: 6,
    required: false
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  user_password?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user-123'
  })
  id: string;

  @ApiProperty({
    description: 'ID de la compañía (ya no disponible)',
    example: null,
    nullable: true
  })
  company_id: string | null;

  @ApiProperty({
    description: 'ID de la oficina (ya no disponible)',
    example: null,
    nullable: true
  })
  office_id: string | null;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez González'
  })
  user_name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@empresa.com'
  })
  user_email: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 1
  })
  user_status: number;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 2
  })
  user_rol: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: Date;
}

export class DeleteUserDto {
  @ApiProperty({
    description: 'ID del usuario a eliminar',
    example: 'user-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;

  @ApiProperty({
    description: 'Contraseña actual',
    example: 'contraseñaActual123'
  })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  current_password: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'nuevaContraseña123',
    minLength: 6
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  new_password: string;
}
