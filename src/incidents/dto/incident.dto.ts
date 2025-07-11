import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty({
    description: 'Código único del incidente',
    example: 'INC-001'
  })
  @IsString({ message: 'El código del incidente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del incidente es requerido' })
  incident_code: string;

  @ApiProperty({
    description: 'Nombre del incidente',
    example: 'Falla en servidor principal'
  })
  @IsString({ message: 'El nombre del incidente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del incidente es requerido' })
  incident_name: string;

  @ApiProperty({
    description: 'Estado del incidente (1 = activo, 0 = inactivo)',
    example: 1,
    default: 1
  })
  @IsNumber({}, { message: 'El estado debe ser un número' })
  @IsOptional()
  incident_status?: number = 1;
}

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiProperty({
    description: 'ID del incidente',
    example: 'incident-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class IncidentResponseDto {
  @ApiProperty({
    description: 'ID del incidente',
    example: 'incident-123'
  })
  id: string;

  @ApiProperty({
    description: 'Código del incidente',
    example: 'INC-001'
  })
  incident_code: string;

  @ApiProperty({
    description: 'Nombre del incidente',
    example: 'Falla en servidor principal'
  })
  incident_name: string;

  @ApiProperty({
    description: 'Estado del incidente',
    example: 1
  })
  incident_status: number;

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

export class DeleteIncidentDto {
  @ApiProperty({
    description: 'ID del incidente a eliminar',
    example: 'incident-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}
