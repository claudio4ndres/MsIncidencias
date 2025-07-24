import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { AuditLog } from "./entities/audit-log.entity";

@Injectable()
export class AuditLogRepository extends Repository<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {
    super(
      auditLogRepository.target,
      auditLogRepository.manager,
      auditLogRepository.queryRunner,
    );
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.find({
      where: { userId },
      order: { timestamp: "DESC" },
    });
  }

  async findByUserEmail(userEmail: string): Promise<AuditLog[]> {
    return this.find({
      where: { userEmail },
      order: { timestamp: "DESC" },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: "DESC" },
    });
  }

  async findByMethod(method: string): Promise<AuditLog[]> {
    return this.find({
      where: { method },
      order: { timestamp: "DESC" },
    });
  }

  async findByPath(path: string): Promise<AuditLog[]> {
    return this.find({
      where: { path },
      order: { timestamp: "DESC" },
    });
  }

  async findRecent(limit: number = 50): Promise<AuditLog[]> {
    return this.find({
      take: limit,
      order: { timestamp: "DESC" },
    });
  }
}
