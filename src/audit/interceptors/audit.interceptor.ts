import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";
import { AuditService } from "../audit.service";
import { CreateAuditLogDto } from "../dto/audit.dto";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    console.log(`[AuditInterceptor] Processing ${request.method} ${request.path}`);
    
    // Solo auditar ciertos métodos HTTP
    const methodsToAudit = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!methodsToAudit.includes(request.method)) {
      console.log(`[AuditInterceptor] Skipping method ${request.method}`);
      return next.handle();
    }

    // Excluir rutas que no necesitan auditoría
    const excludedPaths = [
      "/auth/login",
      "/auth/refresh",
      "/audit", // No auditar las consultas de auditoría
    ];

    const shouldExclude = excludedPaths.some(path => 
      request.path.startsWith(path)
    );

    if (shouldExclude) {
      console.log(`[AuditInterceptor] Excluding path ${request.path}`);
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          // Intentar obtener la información del usuario del request
          const user = (request as any).user;
          
          console.log(`[AuditInterceptor] User found:`, !!user, user ? { id: user.sub || user.id, email: user.email } : 'No user');
          
          if (user) {
            const auditData: CreateAuditLogDto = {
              userId: user.sub || user.id,
              userEmail: user.email || "unknown@example.com",
              method: request.method,
              path: request.path,
              body: this.sanitizeBody(request.body),
            };

            console.log(`[AuditInterceptor] Creating audit log:`, auditData);

            // Crear el registro de auditoría de forma asíncrona sin bloquear la respuesta
            this.auditService.createLog(auditData).then(() => {
              console.log(`[AuditInterceptor] Audit log created successfully`);
            }).catch((error) => {
              console.error("[AuditInterceptor] Error creating audit log:", error);
            });
          } else {
            console.log(`[AuditInterceptor] No user found in request - skipping audit`);
          }
        },
        error: (error) => {
          // También auditar errores si es necesario
          const user = (request as any).user;
          
          if (user) {
            const auditData: CreateAuditLogDto = {
              userId: user.sub || user.id,
              userEmail: user.email || "unknown@example.com",
              method: request.method,
              path: request.path,
              body: {
                ...this.sanitizeBody(request.body),
                error: {
                  message: error.message,
                  status: error.status || 500,
                },
              },
            };

            this.auditService.createLog(auditData).catch((auditError) => {
              console.error("Error creating audit log for error:", auditError);
            });
          }
        },
      })
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;

    // Crear una copia del objeto para no modificar el original
    const sanitized = JSON.parse(JSON.stringify(body));

    // Lista de campos sensibles que no deben ser guardados en la auditoría
    const sensitiveFields = [
      "password",
      "currentPassword",
      "newPassword",
      "confirmPassword",
      "token",
      "accessToken",
      "refreshToken",
      "secret",
      "apiKey",
      "privateKey",
    ];

    // Función recursiva para limpiar campos sensibles
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveFields.some(field => 
          lowerKey.includes(field.toLowerCase())
        );

        if (isSensitive) {
          result[key] = "***REDACTED***";
        } else {
          result[key] = sanitizeObject(value);
        }
      }

      return result;
    };

    return sanitizeObject(sanitized);
  }
}
