import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsEmail,
  IsObject,
  IsDate,
} from "class-validator";

export class CreateAuditLogDto {
  @ApiProperty({ description: "ID del usuario que realiza la acción" })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Email del usuario que realiza la acción" })
  @IsString()
  @IsEmail()
  userEmail: string;

  @ApiProperty({ description: "Método HTTP utilizado", example: "POST" })
  @IsString()
  method: string;

  @ApiProperty({ description: "Ruta del endpoint accedido", example: "/api/movements" })
  @IsString()
  path: string;

  @ApiPropertyOptional({ description: "Cuerpo de la petición", example: {} })
  @IsOptional()
  @IsObject()
  body?: any;
}

export class AuditLogResponseDto {
  @ApiProperty({ description: "ID único del log de auditoría" })
  id: string;

  @ApiProperty({ description: "ID del usuario que realizó la acción" })
  userId: string;

  @ApiProperty({ description: "Email del usuario que realizó la acción" })
  userEmail: string;

  @ApiProperty({ description: "Método HTTP utilizado" })
  method: string;

  @ApiProperty({ description: "Ruta del endpoint accedido" })
  path: string;

  @ApiPropertyOptional({ description: "Cuerpo de la petición" })
  body?: any;

  @ApiProperty({ description: "Fecha y hora de la acción" })
  timestamp: Date;
}

export class AuditLogSearchDto {
  @ApiPropertyOptional({ description: "ID del usuario para filtrar" })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: "Email del usuario para filtrar" })
  @IsOptional()
  @IsString()
  @IsEmail()
  userEmail?: string;

  @ApiPropertyOptional({ description: "Método HTTP para filtrar", example: "POST" })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional({ description: "Ruta para filtrar", example: "/api/movements" })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: "Fecha de inicio para filtrar", example: "2024-01-01T00:00:00Z" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: "Fecha de fin para filtrar", example: "2024-12-31T23:59:59Z" })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class AuditLogStatsDto {
  @ApiProperty({ description: "Total de logs de auditoría" })
  total: number;

  @ApiProperty({ description: "Estadísticas por método HTTP" })
  byMethod: Record<string, number>;

  @ApiProperty({ description: "Estadísticas por usuario" })
  byUser: Record<string, number>;

  @ApiProperty({ description: "Estadísticas por día" })
  byDay: Record<string, number>;

  @ApiPropertyOptional({ description: "Período de tiempo analizado" })
  period?: {
    startDate: Date;
    endDate: Date;
  } | string;
}
