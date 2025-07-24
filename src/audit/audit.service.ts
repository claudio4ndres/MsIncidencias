import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Between, ILike } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { AuditLogRepository } from "../_common/repository/audit-log.repository";
import { AuditLog } from "../_common/repository/entities/audit-log.entity";
import {
  CreateAuditLogDto,
  AuditLogResponseDto,
  AuditLogSearchDto,
  AuditLogStatsDto,
} from "./dto/audit.dto";

@Injectable()
export class AuditService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async createLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      console.log('[AuditService] Creating audit log with data:', createAuditLogDto);
      
      const auditLog = this.auditLogRepository.create({
        id: uuidv4(),
        ...createAuditLogDto,
        timestamp: new Date(),
      });

      console.log('[AuditService] Audit log entity created:', auditLog);
      
      const result = await this.auditLogRepository.save(auditLog);
      console.log('[AuditService] Audit log saved successfully');
      
      return result;
    } catch (error) {
      console.error('[AuditService] Error creating audit log:', error);
      throw new InternalServerErrorException(
        `Error al crear el registro de auditoría: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<AuditLogResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const where = search
        ? [
            { userEmail: ILike(`%${search}%`) },
            { method: ILike(`%${search}%`) },
            { path: ILike(`%${search}%`) },
          ]
        : {};

      const [auditLogs, total] = await Promise.all([
        this.auditLogRepository.find({
          where,
          skip,
          take: pageSize,
          order: { timestamp: "DESC" },
        }),
        this.auditLogRepository.count({ where }),
      ]);

      const auditLogsDto = auditLogs.map((log) => this.mapToResponseDto(log));
      return new PaginatedResponseDto(auditLogsDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener los registros de auditoría"
      );
    }
  }

  async findOne(id: string): Promise<AuditLogResponseDto> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
    });

    if (!auditLog) {
      throw new NotFoundException("Registro de auditoría no encontrado");
    }

    return this.mapToResponseDto(auditLog);
  }

  async findByUserId(userId: string): Promise<AuditLogResponseDto[]> {
    try {
      const auditLogs = await this.auditLogRepository.findByUserId(userId);
      return auditLogs.map((log) => this.mapToResponseDto(log));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener registros por usuario"
      );
    }
  }

  async findByUserEmail(userEmail: string): Promise<AuditLogResponseDto[]> {
    try {
      const auditLogs = await this.auditLogRepository.findByUserEmail(userEmail);
      return auditLogs.map((log) => this.mapToResponseDto(log));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener registros por email"
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AuditLogResponseDto[]> {
    try {
      const auditLogs = await this.auditLogRepository.findByDateRange(
        startDate,
        endDate
      );
      return auditLogs.map((log) => this.mapToResponseDto(log));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener registros por rango de fechas"
      );
    }
  }

  async search(
    searchDto: AuditLogSearchDto,
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<AuditLogResponseDto>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition: any = {};

      if (searchDto.userId) {
        whereCondition.userId = searchDto.userId;
      }

      if (searchDto.userEmail) {
        whereCondition.userEmail = ILike(`%${searchDto.userEmail}%`);
      }

      if (searchDto.method) {
        whereCondition.method = searchDto.method;
      }

      if (searchDto.path) {
        whereCondition.path = ILike(`%${searchDto.path}%`);
      }

      if (searchDto.startDate && searchDto.endDate) {
        whereCondition.timestamp = Between(
          new Date(searchDto.startDate),
          new Date(searchDto.endDate)
        );
      }

      const [auditLogs, total] = await Promise.all([
        this.auditLogRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { timestamp: "DESC" },
        }),
        this.auditLogRepository.count({ where: whereCondition }),
      ]);

      const auditLogsDto = auditLogs.map((log) => this.mapToResponseDto(log));
      return new PaginatedResponseDto(auditLogsDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al buscar registros de auditoría");
    }
  }

  async getRecent(limit: number = 50): Promise<AuditLogResponseDto[]> {
    try {
      const auditLogs = await this.auditLogRepository.findRecent(limit);
      return auditLogs.map((log) => this.mapToResponseDto(log));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener registros recientes"
      );
    }
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<AuditLogStatsDto> {
    try {
      const whereCondition: any = {};

      if (startDate && endDate) {
        whereCondition.timestamp = Between(startDate, endDate);
      }

      const auditLogs = await this.auditLogRepository.find({
        where: whereCondition,
      });

      const total = auditLogs.length;
      
      // Estadísticas por método HTTP
      const byMethod: Record<string, number> = {};
      auditLogs.forEach((log) => {
        byMethod[log.method] = (byMethod[log.method] || 0) + 1;
      });

      // Estadísticas por usuario
      const byUser: Record<string, number> = {};
      auditLogs.forEach((log) => {
        byUser[log.userEmail] = (byUser[log.userEmail] || 0) + 1;
      });

      // Estadísticas por día
      const byDay: Record<string, number> = {};
      auditLogs.forEach((log) => {
        const day = log.timestamp.toISOString().split("T")[0];
        byDay[day] = (byDay[day] || 0) + 1;
      });

      return {
        total,
        byMethod,
        byUser,
        byDay,
        period: startDate && endDate ? { startDate, endDate } : "all_time",
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener estadísticas de auditoría"
      );
    }
  }

  async deleteOldLogs(daysToKeep: number = 90): Promise<{ deleted: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.auditLogRepository.delete({
        timestamp: Between(new Date("1970-01-01"), cutoffDate),
      });

      return { deleted: result.affected || 0 };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al eliminar registros antiguos"
      );
    }
  }

  private mapToResponseDto(auditLog: AuditLog): AuditLogResponseDto {
    return {
      id: auditLog.id,
      userId: auditLog.userId,
      userEmail: auditLog.userEmail,
      method: auditLog.method,
      path: auditLog.path,
      body: auditLog.body,
      timestamp: auditLog.timestamp,
    };
  }
}
