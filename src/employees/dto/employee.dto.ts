import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'ID de la oficina', example: 'office-123' })
  @IsString()
  @IsNotEmpty()
  office_id: string;

  @ApiProperty({ description: 'Código del empleado', example: 12345 })
  @IsNumber()
  @IsNotEmpty()
  employee_code: number;

  @ApiProperty({ description: 'Nombre del empleado', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty({ description: 'Tipo de empleado', example: 'Técnico' })
  @IsString()
  @IsNotEmpty()
  employee_type: string;

  @ApiProperty({ description: 'Estado del empleado', example: 1 })
  @IsNumber()
  @IsOptional()
  employee_status?: number = 1;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiProperty({ description: 'ID del empleado', example: 'emp-123' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  office_id: string;
  
  @ApiProperty()
  employee_code: number;
  
  @ApiProperty()
  employee_name: string;
  
  @ApiProperty()
  employee_type: string;
  
  @ApiProperty()
  employee_status: number;
  
  @ApiProperty()
  created_at: Date;
  
  @ApiProperty()
  updated_at: Date;
}

export class DeleteEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
