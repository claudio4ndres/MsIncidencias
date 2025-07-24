import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog } from "../_common/repository/entities/audit-log.entity";
import { AuditLogRepository } from "../_common/repository/audit-log.repository";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";
import { AuditInterceptor } from "./interceptors/audit.interceptor";
import { AuditHelperService } from "./services/audit-helper.service";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService, AuditLogRepository, AuditInterceptor, AuditHelperService],
  exports: [AuditService, AuditInterceptor, AuditHelperService],
})
export class AuditModule {}
