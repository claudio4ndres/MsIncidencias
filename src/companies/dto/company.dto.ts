import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Televisión Mexicana S.A.'
  })
  @IsString({ message: 'El nombre de la compañía debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la compañía es requerido' })
  company_name: string;

  @ApiProperty({
    description: 'Estado de la compañía (1 = activo, 0 = inactivo)',
    example: 1
  })
  @IsNumber({}, { message: 'El estado debe ser un número' })
  @IsNotEmpty({ message: 'El estado es requerido' })
  company_status: number;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({
    description: 'ID de la compañía',
    example: 'comp-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class CompanyResponseDto {
  @ApiProperty({
    description: 'ID de la compañía',
    example: 'comp-123'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Televisión Mexicana S.A.'
  })
  company_name: string;

  @ApiProperty({
    description: 'Estado de la compañía',
    example: 1
  })
  company_status: number;

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

export class DeleteCompanyDto {
  @ApiProperty({
    description: 'ID de la compañía a eliminar',
    example: 'comp-123'
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}
