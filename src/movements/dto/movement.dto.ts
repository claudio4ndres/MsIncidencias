import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateMovementDto {
  @ApiProperty({
    description: "Código del empleado",
    example: 12345,
  })
  @IsNumber({}, { message: "El código del empleado debe ser un número" })
  @IsNotEmpty({ message: "El código del empleado es requerido" })
  employee_code: number;

  @ApiProperty({
    description: "Código del incidente",
    example: "INC-001",
  })
  @IsString({ message: "El código del incidente debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El código del incidente es requerido" })
  incident_code: string;

  @ApiProperty({
    description: "Fecha de la incidencia",
    example: "2024-01-01T12:00:00.000Z",
  })
  @IsDateString(
    {},
    { message: "La fecha de incidencia debe ser una fecha válida" }
  )
  @IsNotEmpty({ message: "La fecha de incidencia es requerida" })
  incidence_date: string;

  @ApiProperty({
    description: "Observaciones de la incidencia",
    example: "El empleado llegó tarde debido a problemas de transporte",
  })
  @IsString({ message: "Las observaciones deben ser una cadena de texto" })
  @IsNotEmpty({ message: "Las observaciones son requeridas" })
  incidence_observation: string;

  @ApiProperty({
    description: "Estado de la incidencia (1 = activo, 0 = inactivo)",
    example: 1,
    default: 1,
  })
  @IsNumber({}, { message: "El estado debe ser un número" })
  @IsOptional()
  incidence_status?: number = 1;
}

export class UpdateMovementDto extends PartialType(CreateMovementDto) {
  @ApiProperty({
    description: "ID del movimiento",
    example: "movement-123",
  })
  @IsString({ message: "El ID debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El ID es requerido" })
  id: string;
}

export class MovementResponseDto {
  @ApiProperty({
    description: "ID del movimiento",
    example: "movement-123",
  })
  id: string;

  @ApiProperty({
    description: "Código del empleado",
    example: 12345,
  })
  employee_code: number;

  @ApiProperty({
    description: "Código del incidente",
    example: "INC-001",
  })
  incident_code: string;

  @ApiProperty({
    description: "Fecha de la incidencia",
    example: "2024-01-01T12:00:00.000Z",
  })
  incidence_date: Date;

  @ApiProperty({
    description: "Observaciones de la incidencia",
    example: "El empleado llegó tarde debido a problemas de transporte",
  })
  incidence_observation: string;

  @ApiProperty({
    description: "Estado de la incidencia",
    example: 1,
  })
  incidence_status: number;

  @ApiProperty({
    description: "Fecha de creación",
    example: "2024-01-01T00:00:00.000Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Fecha de actualización",
    example: "2024-01-01T00:00:00.000Z",
  })
  updated_at: Date;

  @ApiProperty({
    description: "Información del empleado asociado",
    required: false,
  })
  employee?: {
    id: string;
    employee_name: string;
    employee_type: string;
  };

  @ApiProperty({
    description: "Información del incidente asociado",
    required: false,
  })
  incident?: {
    id: string;
    incident_name: string;
    incident_status: number;
  };
}

export class DeleteMovementDto {
  @ApiProperty({
    description: "ID del movimiento a eliminar",
    example: "movement-123",
  })
  @IsString({ message: "El ID debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El ID es requerido" })
  id: string;
}

export class MovementSearchDto {
  @ApiProperty({
    description: "Código del empleado para filtrar",
    example: 12345,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "El código del empleado debe ser un número" })
  employee_code?: number;

  @ApiProperty({
    description: "Código del incidente para filtrar",
    example: "INC-001",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "El código del incidente debe ser una cadena de texto" })
  incident_code?: string;

  @ApiProperty({
    description: "Estado de la incidencia para filtrar",
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "El estado debe ser un número" })
  incidence_status?: number;

  @ApiProperty({
    description: "Fecha de inicio para filtrar por rango (YYYY-MM-DD)",
    example: "2024-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: "La fecha de inicio debe ser una fecha válida" })
  start_date?: string;

  @ApiProperty({
    description: "Fecha de fin para filtrar por rango (YYYY-MM-DD)",
    example: "2024-01-31",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: "La fecha de fin debe ser una fecha válida" })
  end_date?: string;
}
