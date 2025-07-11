import { IsOptional, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tamaño de página debe ser un número entero' })
  @Min(1, { message: 'El tamaño de página debe ser mayor a 0' })
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Término de búsqueda',
    example: 'texto a buscar'
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search?: string = '';
}

export class PaginatedResponseDto<T> {
  @ApiPropertyOptional({
    description: 'Lista de elementos',
    isArray: true
  })
  data: T[];

  @ApiPropertyOptional({
    description: 'Total de elementos',
    example: 100
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Página actual',
    example: 1
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Elementos por página',
    example: 10
  })
  pageSize: number;

  @ApiPropertyOptional({
    description: 'Total de páginas',
    example: 10
  })
  totalPages: number;

  constructor(data: T[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
