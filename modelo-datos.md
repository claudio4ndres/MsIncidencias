# Modelo de Datos - Sistema de Incidencias

## Resumen General

Este sistema de incidencias maneja la gestión de empleados, incidencias y movimientos dentro de una estructura organizacional que incluye compañías, oficinas y usuarios con control de acceso.

## Diagrama de Entidades

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Companies    │────▶│     Offices     │────▶│   Employees     │
│                 │     │                 │     │                 │
│ • id (PK)       │     │ • id (PK)       │     │ • id (PK)       │
│ • company_name  │     │ • company_id    │     │ • office_id     │
│ • company_status│     │ • office_name   │     │ • employee_code │
│ • created_at    │     │ • office_status │     │ • employee_name │
│ • updated_at    │     │ • created_at    │     │ • employee_type │
└─────────────────┘     │ • updated_at    │     │ • employee_status│
                        └─────────────────┘     │ • created_at    │
                                                │ • updated_at    │
                                                └─────────────────┘
                                                          │
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │   Movements     │
                                                │                 │
                                                │ • id (PK)       │
                                                │ • employee_code │
                                                │ • incident_code │
                                                │ • incidence_date│
                                                │ • incidence_obs │
                                                │ • incidence_stat│
                                                │ • created_at    │
                                                │ • updated_at    │
                                                └─────────────────┘
                                                          ▲
                                                          │
                                                          │
                                                ┌─────────────────┐
                                                │   Incidents     │
                                                │                 │
                                                │ • id (PK)       │
                                                │ • incident_code │
                                                │ • incident_name │
                                                │ • incident_status│
                                                │ • created_at    │
                                                │ • updated_at    │
                                                └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     Users       │────▶│   User_Access   │
│                 │     │                 │
│ • id (PK)       │     │ • id (PK)       │
│ • user_name     │     │ • user_id       │
│ • user_email    │     │ • company_id    │
│ • user_password │     │ • office_id     │
│ • user_status   │     │ • status        │
│ • user_rol      │     │ • created_at    │
│ • created_at    │     │ • updated_at    │
│ • updated_at    │     └─────────────────┘
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    Calendar     │     │   Ms_Ollamani   │
│                 │     │                 │
│ • id (PK)       │     │ • id (PK)       │
│ • month         │     │ • nombre        │
│ • period        │     │ • descripcion   │
│ • range         │     │ • activo        │
│ • incident_sub  │     │ • fecha_creacion│
│ • process       │     │ • fecha_actual  │
│ • policy_gen    │     └─────────────────┘
│ • payment       │
└─────────────────┘
```

## Entidades Principales

### 1. Companies (Compañías)
**Tabla:** `companies`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| company_name | VARCHAR(191) | Nombre de la compañía |
| company_status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Uno a muchos con `Offices`
- Uno a muchos con `User_Access`

**Índices:**
- `idx_company_status` en `company_status`
- `idx_company_name` en `company_name`

### 2. Offices (Oficinas)
**Tabla:** `offices`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| company_id | VARCHAR(191) | ID de la compañía (FK) |
| office_name | VARCHAR(191) | Nombre de la oficina |
| office_status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Muchos a uno con `Companies`
- Uno a muchos con `Employees`
- Uno a muchos con `User_Access`

**Índices:**
- `idx_office_company_id` en `company_id`
- `idx_office_status` en `office_status`
- `idx_office_name` en `office_name`

### 3. Employees (Empleados)
**Tabla:** `employees`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| office_id | VARCHAR(191) | ID de la oficina (FK) |
| employee_code | INT | Código único del empleado |
| employee_name | VARCHAR(191) | Nombre del empleado |
| employee_type | VARCHAR(191) | Tipo de empleado |
| employee_status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Muchos a uno con `Offices`
- Uno a muchos con `Movements`

**Índices:**
- `idx_employee_office_id` en `office_id`
- `idx_employee_code` en `employee_code`
- `idx_employee_status` en `employee_status`
- `idx_employee_type` en `employee_type`

### 4. Incidents (Incidencias)
**Tabla:** `incidents`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| incident_code | VARCHAR(191) | Código único del incidente |
| incident_name | VARCHAR(191) | Nombre del incidente |
| incident_status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Uno a muchos con `Movements`

**Índices:**
- `idx_incident_code` en `incident_code`
- `idx_incident_status` en `incident_status`
- `idx_incident_name` en `incident_name`

### 5. Movements (Movimientos)
**Tabla:** `movements`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| employee_code | INT | Código del empleado (FK) |
| incident_code | VARCHAR(191) | Código del incidente (FK) |
| incidence_date | DATETIME | Fecha de la incidencia |
| incidence_observation | VARCHAR(191) | Observaciones |
| incidence_status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Muchos a uno con `Employees`
- Muchos a uno con `Incidents`

**Índices:**
- `idx_movement_employee_code` en `employee_code`
- `idx_movement_incident_code` en `incident_code`
- `idx_movement_status` en `incidence_status`
- `idx_movement_date` en `incidence_date`

### 6. Users (Usuarios)
**Tabla:** `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | Identificador único (PK) |
| user_name | VARCHAR(191) | Nombre del usuario |
| user_email | VARCHAR(191) | Email único del usuario |
| user_password | VARCHAR(191) | Contraseña encriptada |
| user_status | INT | Estado (1=activo, 0=inactivo) |
| user_rol | INT | Rol (1=admin, 2=usuario, 3=técnico) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Uno a muchos con `User_Access`

**Índices:**
- `idx_user_email` en `user_email`
- `idx_user_status` en `user_status`
- `idx_user_rol` en `user_rol`

### 7. User_Access (Acceso de Usuarios)
**Tabla:** `user_access`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK, auto-increment) |
| user_id | VARCHAR(191) | ID del usuario (FK) |
| company_id | VARCHAR(191) | ID de la compañía (FK) |
| office_id | VARCHAR(191) | ID de la oficina (FK) |
| status | INT | Estado (1=activo, 0=inactivo) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Muchos a uno con `Users`
- Muchos a uno con `Companies`
- Muchos a uno con `Offices`

**Índices:**
- `idx_user_access_user_id` en `user_id`
- `idx_user_access_company_id` en `company_id`
- `idx_user_access_office_id` en `office_id`
- `idx_user_access_status` en `status`
- `idx_user_access_composite` en `user_id`, `company_id`, `office_id`

### 8. Calendar (Calendario)
**Tabla:** `calendar`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK, auto-increment) |
| month | VARCHAR(255) | Mes |
| period | VARCHAR(255) | Período |
| range | VARCHAR(255) | Rango |
| incidentSubmission | DATETIME | Fecha de envío de incidencia |
| process | DATETIME | Fecha de proceso |
| policyGeneration | DATETIME | Fecha de generación de póliza |
| payment | DATETIME | Fecha de pago |

**Relaciones:**
- Entidad independiente (sin relaciones FK)

### 9. Ms_Ollamani
**Tabla:** `ms_ollamani`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK, auto-increment) |
| nombre | VARCHAR(100) | Nombre del elemento |
| descripcion | VARCHAR(500) | Descripción del elemento |
| activo | BOOLEAN | Estado (true=activo, false=inactivo) |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_actualizacion | TIMESTAMP | Fecha de actualización |

**Relaciones:**
- Entidad independiente (sin relaciones FK)

**Índices:**
- `idx_ms_ollamani_activo` en `activo`
- `idx_ms_ollamani_nombre` en `nombre`
- `idx_ms_ollamani_fecha_creacion` en `fecha_creacion`

## Características del Modelo

### Integridad Referencial
- **CASCADE**: Actualizaciones se propagan automáticamente
- **RESTRICT**: Evita eliminaciones que violen la integridad referencial
- **ON DELETE CASCADE**: Solo en `User_Access` → `Users`

### Convenciones de Naming
- Nombres de tablas en plural
- Campos de clave foránea con sufijo `_id`
- Timestamps estándar: `created_at`, `updated_at`
- Campos de estado numéricos: 1=activo, 0=inactivo

### Índices de Rendimiento
- Índices en campos de estado para filtrado rápido
- Índices en campos de búsqueda frecuente (nombres, códigos)
- Índices compuestos para consultas complejas

### Patrones de Diseño
- **Audit Trail**: Todos los registros tienen timestamps de creación y actualización
- **Soft Delete**: Control de estado mediante campos de status
- **Código Único**: Códigos únicos para empleados e incidencias
- **Control de Acceso**: Tabla intermedia para gestión de permisos por usuario/compañía/oficina

## Flujo de Negocio

1. **Estructura Organizacional**: Companies → Offices → Employees
2. **Gestión de Incidencias**: Incidents (catálogo) → Movements (registros específicos)
3. **Control de Acceso**: Users → User_Access → Companies/Offices
4. **Calendario**: Gestión de períodos y fechas críticas
5. **Elementos Ollamani**: Funcionalidad específica del sistema

## Consideraciones Técnicas

- **ORM**: TypeORM con decoradores para mapeo entidad-tabla
- **Base de Datos**: Diseñado para MySQL/MariaDB
- **Precisión Temporal**: Timestamps con microsegundos (precisión 6)
- **Longitud de Campos**: VARCHAR(191) para compatibilidad con índices UTF8MB4
- **Validaciones**: Campos NOT NULL y restricciones de unicidad a nivel de base de datos
