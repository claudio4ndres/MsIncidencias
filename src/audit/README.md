# Módulo de Auditoría

El módulo de auditoría proporciona un sistema completo para registrar y consultar las acciones realizadas por los usuarios en el sistema.

## Características

- ✅ Registro automático de peticiones HTTP (POST, PUT, PATCH, DELETE)
- ✅ Sanitización automática de datos sensibles
- ✅ API completa para consultar registros de auditoría
- ✅ Estadísticas y análisis de actividad
- ✅ Limpieza automática de registros antiguos
- ✅ Servicio helper para registrar acciones específicas
- ✅ Interceptor configurable para auditoría automática

## Estructura

```
src/audit/
├── dto/
│   └── audit.dto.ts              # DTOs para requests y responses
├── interceptors/
│   └── audit.interceptor.ts      # Interceptor para auditoría automática
├── services/
│   └── audit-helper.service.ts   # Servicio helper para acciones específicas
├── audit.controller.ts           # Controlador REST para consultas
├── audit.service.ts              # Servicio principal de auditoría
├── audit.module.ts               # Módulo de NestJS
└── README.md                     # Esta documentación
```

## Uso

### Auditoría Automática

El interceptor `AuditInterceptor` se registra automáticamente para auditar:
- Métodos HTTP: POST, PUT, PATCH, DELETE
- Excluye rutas sensibles como `/auth/login`, `/auth/refresh`, `/audit`
- Sanitiza automáticamente campos como passwords, tokens, etc.

### Auditoría Manual

Puedes usar el `AuditHelperService` para registrar acciones específicas:

```typescript
import { AuditHelperService } from './audit/services/audit-helper.service';

// Inyectar el servicio
constructor(private readonly auditHelper: AuditHelperService) {}

// Registrar una acción CRUD
await this.auditHelper.logCrudOperation(
  userId,
  userEmail,
  'CREATE',
  'movements',
  newMovement.id,
  undefined,
  newMovement
);

// Registrar un login
await this.auditHelper.logLogin(userId, userEmail, true, ipAddress);

// Registrar acceso a datos sensibles
await this.auditHelper.logDataAccess(
  userId,
  userEmail,
  'employee_data',
  employeeId
);
```

### API REST

El módulo expone los siguientes endpoints (solo para administradores):

#### GET `/audit`
Lista registros de auditoría con paginación y búsqueda

**Parámetros de query:**
- `page`: Número de página (default: 1)
- `pageSize`: Registros por página (default: 10)
- `search`: Término de búsqueda

#### POST `/audit/search`
Búsqueda avanzada con filtros

**Body:**
```json
{
  "userId": "uuid-opcional",
  "userEmail": "email-opcional",
  "method": "POST",
  "path": "/api/movements",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

#### GET `/audit/stats`
Estadísticas de auditoría

**Parámetros de query:**
- `start_date`: Fecha de inicio (opcional)
- `end_date`: Fecha de fin (opcional)

#### GET `/audit/recent`
Registros recientes

**Parámetros de query:**
- `limit`: Número máximo de registros (default: 50)

#### GET `/audit/user/:userId`
Registros de un usuario específico

#### GET `/audit/email/:userEmail`
Registros por email de usuario

#### GET `/audit/date-range`
Registros por rango de fechas

**Parámetros de query:**
- `start_date`: Fecha de inicio (requerida)
- `end_date`: Fecha de fin (requerida)

#### GET `/audit/:id`
Registro específico por ID

#### DELETE `/audit/cleanup`
Eliminar registros antiguos

**Parámetros de query:**
- `days`: Días a conservar (default: 90)

## Configuración

### Variables de Entorno

No requiere configuración adicional. Utiliza la misma base de datos configurada para el proyecto.

### Migración

Ejecutar la migración para crear la tabla de auditoría:

```bash
npm run migration:run
```

### Interceptor Global

El interceptor se puede registrar globalmente en `app.module.ts`:

```typescript
import { AuditInterceptor } from './audit/interceptors/audit.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
```

## Seguridad

- **Acceso Restringido**: Solo administradores pueden consultar registros de auditoría
- **Sanitización**: Los datos sensibles son automáticamente censurados
- **Campos Sanitizados**: password, token, secret, apiKey, privateKey, etc.
- **Logging de Errores**: Los errores en auditoría se registran sin interrumpir el flujo principal

## Mantenimiento

### Limpieza Automática

El sistema incluye un endpoint para limpiar registros antiguos:

```bash
# Eliminar registros mayores a 90 días (default)
curl -X DELETE "https://api.example.com/audit/cleanup" -H "Authorization: Bearer token"

# Eliminar registros mayores a 30 días
curl -X DELETE "https://api.example.com/audit/cleanup?days=30" -H "Authorization: Bearer token"
```

### Monitoreo

Revisar regularmente:
- Volumen de registros de auditoría
- Errores en el proceso de auditoría
- Rendimiento del sistema con auditoría activa

## Ejemplos de Registros

### Registro HTTP Automático
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "userEmail": "user@example.com",
  "method": "POST",
  "path": "/api/movements",
  "body": {
    "employee_code": 12345,
    "incident_code": "VAC",
    "incidence_date": "2024-01-15",
    "password": "***REDACTED***"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Registro de Acción Específica
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "userEmail": "admin@example.com",
  "method": "ACTION",
  "path": "user_permissions/target-user-uuid",
  "body": {
    "action": "PERMISSION_CHANGE",
    "resource": "user_permissions",
    "targetUserId": "target-user-uuid",
    "targetUserEmail": "target@example.com",
    "permissionAction": "GRANT_ADMIN",
    "permissions": ["ADMIN", "USER_MANAGEMENT"],
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
