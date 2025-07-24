import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit.service";
import { CreateAuditLogDto } from "../dto/audit.dto";

@Injectable()
export class AuditHelperService {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Registra una acción de auditoría de forma síncrona
   */
  async logAction(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId?: string,
    additionalData?: any
  ): Promise<void> {
    const auditData: CreateAuditLogDto = {
      userId,
      userEmail,
      method: "ACTION",
      path: `${resource}${resourceId ? `/${resourceId}` : ""}`,
      body: {
        action,
        resource,
        resourceId,
        timestamp: new Date().toISOString(),
        ...additionalData,
      },
    };

    await this.auditService.createLog(auditData);
  }

  /**
   * Registra una acción de auditoría de forma asíncrona (fire-and-forget)
   */
  logActionAsync(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId?: string,
    additionalData?: any
  ): void {
    this.logAction(userId, userEmail, action, resource, resourceId, additionalData)
      .catch((error) => {
        console.error("Error logging audit action:", error);
      });
  }

  /**
   * Registra una operación de login
   */
  async logLogin(userId: string, userEmail: string, success: boolean, ipAddress?: string): Promise<void> {
    await this.logAction(
      userId,
      userEmail,
      success ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
      "authentication",
      userId,
      {
        ipAddress,
        success,
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Registra una operación de logout
   */
  async logLogout(userId: string, userEmail: string): Promise<void> {
    await this.logAction(
      userId,
      userEmail,
      "LOGOUT",
      "authentication",
      userId,
      {
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Registra una operación CRUD
   */
  async logCrudOperation(
    userId: string,
    userEmail: string,
    operation: "CREATE" | "UPDATE" | "DELETE",
    resource: string,
    resourceId: string,
    oldData?: any,
    newData?: any
  ): Promise<void> {
    await this.logAction(
      userId,
      userEmail,
      operation,
      resource,
      resourceId,
      {
        operation,
        oldData: operation === "UPDATE" || operation === "DELETE" ? oldData : undefined,
        newData: operation === "CREATE" || operation === "UPDATE" ? newData : undefined,
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Registra un cambio de permisos o acceso
   */
  async logPermissionChange(
    userId: string,
    userEmail: string,
    targetUserId: string,
    targetUserEmail: string,
    action: string,
    permissions?: any
  ): Promise<void> {
    await this.logAction(
      userId,
      userEmail,
      "PERMISSION_CHANGE",
      "user_permissions",
      targetUserId,
      {
        targetUserId,
        targetUserEmail,
        permissionAction: action,
        permissions,
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Registra un acceso a datos sensibles
   */
  async logDataAccess(
    userId: string,
    userEmail: string,
    dataType: string,
    dataId?: string,
    query?: any
  ): Promise<void> {
    await this.logAction(
      userId,
      userEmail,
      "DATA_ACCESS",
      dataType,
      dataId,
      {
        dataType,
        query: query ? this.sanitizeQuery(query) : undefined,
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Sanitiza queries para remover datos sensibles
   */
  private sanitizeQuery(query: any): any {
    if (!query || typeof query !== "object") {
      return query;
    }

    const sanitized = { ...query };
    const sensitiveFields = ["password", "token", "secret", "key"];

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = "***REDACTED***";
      }
    });

    return sanitized;
  }
}
