import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Nombre completo del usuario",
    example: "Juan Pérez",
  })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es requerido" })
  user_name: string;

  @ApiProperty({
    description: "Email del usuario",
    example: "juan.perez@ejemplo.com",
  })
  @IsEmail({}, { message: "El email debe tener un formato válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  user_email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "miContraseña123",
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La contraseña es requerida" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  user_password: string;

  @ApiProperty({
    description: "Estado del usuario (1 = activo, 0 = inactivo)",
    example: 1,
    default: 1,
  })
  @IsNumber({}, { message: "El estado debe ser un número" })
  @IsOptional()
  user_status?: number = 1;

  @ApiProperty({
    description: "Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)",
    example: 2,
  })
  @IsNumber({}, { message: "El rol debe ser un número" })
  @IsNotEmpty({ message: "El rol es requerido" })
  user_rol: number;

  @ApiProperty({
    description: "ID de la empresa a la que pertenece el usuario",
    example: "7f2e9d37-5c41-11f0-ae2b-0242ac150002",
  })
  @IsString()
  @IsNotEmpty({ message: "El ID de la empresa es requerido" })
  company_id: string;

  @ApiProperty({
    description: "ID de la oficina a la que pertenece el usuario (opcional)",
    example: "7f2e9d37-5c41-11f0-ae2b-0242ac150003",
  })
  @IsString()
  @IsNotEmpty({ message: "El ID de la oficina es requerido" })
  office_id: string;
}
