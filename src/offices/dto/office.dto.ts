import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOfficeDto {
  @ApiProperty({ description: 'ID de la compañía', example: 'comp-123' })
  @IsString()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({ description: 'Nombre de la oficina', example: 'Oficina Centro' })
  @IsString()
  @IsNotEmpty()
  office_name: string;

  @ApiProperty({ description: 'Estado de la oficina', example: 1 })
  @IsNumber()
  @IsOptional()
  office_status?: number = 1;
}

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {
  @ApiProperty({ description: 'ID de la oficina', example: 'office-123' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class OfficeResponseDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  company_id: string;
  
  @ApiProperty()
  company_name: string;
  
  @ApiProperty()
  office_name: string;
  
  @ApiProperty()
  office_status: number;
  
  @ApiProperty()
  created_at: Date;
  
  @ApiProperty()
  updated_at: Date;
}

export class DeleteOfficeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
