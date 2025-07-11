# MS Arquetipo Dale - NestJS

Un microservicio arquetipo desarrollado con NestJS, TypeScript y TypeORM que sirve como plantilla base para el desarrollo de microservicios empresariales.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Modelo de Datos](#modelo-de-datos)
- [Ejecutar Datos Semillas](#ejecutar-datos-semillas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Docker](#-docker)
- [Migraciones de Base de Datos](#-migraciones-de-base-de-datos)
- [Documentación Adicional](#-documentación-adicional)
- [Contribución](#-contribución)

## ✨ Características

- **API RESTful** con versionado automático
- **Autenticación JWT** integrada
- **Base de datos MySQL** con TypeORM
- **Documentación automática** con Swagger/OpenAPI
- **Logging avanzado** con interceptores personalizados
- **Validación de datos** con class-validator
- **Cacheo Redis** (opcional)
- **Manejo de errores** centralizado
- **Configuración por ambientes**
- **Path aliases** para imports limpios
- **CORS habilitado**
- **Health checks** incluidos

## 🛠 Tecnologías

- **Framework**: NestJS v10
- **Lenguaje**: TypeScript (ES2021)
- **Base de Datos**: MySQL v8+
- **ORM**: TypeORM v0.3
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Cache**: Redis (opcional)
- **Validación**: class-validator & class-transformer

## 📋 Requisitos Previos

- Node.js >= 16.13
- npm >= 8.0
- MySQL >= 8.0
- Redis (opcional)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd arquetiponestjs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Editar el archivo `.env.local`** con tus configuraciones:
```env
# Configuración de la aplicación
NODE_ENV=development
PORT=3000

# Configuración de base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-contraseña
DB_DATABASE=ms_arquetipo_db

# Configuración JWT
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRES_IN=1h

# Configuración de microservicios
MS_NOMBRE_SM=ms-arquetipo-dale

# Configuración de Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Configuración de logs
LOG_LEVEL=info
```

5. **Ejecutar migraciones**
```bash
npm run migration:run
```

6. **Ejecutar datos semillas (opcional)**
```bash
mysql -h localhost -P 3307 -u root -p ms_incidencias < seeds.sql
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Ambiente de ejecución | `development` |
| `PORT` | Puerto de la aplicación | `3000` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USERNAME` | Usuario de la BD | - |
| `DB_PASSWORD` | Contraseña de la BD | - |
| `DB_DATABASE` | Nombre de la BD | - |
| `JWT_SECRET` | Clave secreta JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT | `1h` |

### Configuración de Base de Datos

El proyecto utiliza TypeORM con MySQL. La configuración se encuentra en:
- `src/_common/repository/config/database.config.ts`
- `src/_common/repository/config/typeorm.config.ts`

## 🎯 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

### Watch Mode
```bash
npm run start:watch
```

## Modelo de Datos

El modelo de datos se compone de múltiples entidades que forman la base del sistema de incidencias. Las entidades principales son:

- **Companies**: Información de empresas.
- **Offices**: Ubicaciones de las oficinas dentro de las empresas.
- **Employees**: Registro de empleados asociados a oficinas específicas.
- **Incidents**: Tipos de incidencias que pueden ser reportadas.
- **Movements**: Registros de incidentes asociados a empleados.
- **Users**: Usuarios registrados en el sistema.
- **User Access**: Control acceso para usuarios por compañía y oficina.
- **Calendar**: Gestión de períodos relevantes y fechas críticas.

Para más detalles, consulta el archivo `modelo-datos.md`.

## Ejecutar Datos Semillas

Para inicializar la base de datos con datos semillas, ejecuta el siguiente comando:

```bash
mysql -h localhost -P 3307 -u root -p ms_incidencias < seeds.sql
```

Asegúrate de que las credenciales de la base de datos coincidan con tu configuración.

## 📁 Estructura del Proyecto
```
src/
├── _common/                           # Módulos compartidos
│   ├── aws/                          # Servicios de AWS
│   ├── config/                       # Configuraciones
│   │   ├── simple-config/            # Configuración simple
│   │   └── secret-config/            # Configuración de secretos
│   ├── constants/                    # Constantes globales
│   ├── coopeuch/                     # Integración con servicios
│   ├── decorators/                   # Decoradores personalizados
│   ├── dtos/                         # Data Transfer Objects
│   ├── enums/                        # Enumeraciones
│   ├── exceptions/                   # Manejo de excepciones
│   ├── guards/                       # Guards de autenticación
│   ├── helpers/                      # Funciones auxiliares
│   ├── interceptor/                  # Interceptores HTTP
│   ├── interfaces/                   # Interfaces TypeScript
│   ├── logger/                       # Sistema de logging
│   ├── middleware/                   # Middlewares Express
│   ├── pipes/                        # Pipes de validación
│   ├── repository/                   # Entidades y repositorios
│   │   ├── config/                   # Configuración de BD
│   │   ├── entities/                 # Entidades de TypeORM
│   │   ├── migrations/               # Migraciones de BD
│   │   └── repositories/             # Repositorios personalizados
│   ├── utils/                        # Utilidades
│   └── validators/                   # Validadores personalizados
├── ollamani/                         # Módulo de ejemplo
│   ├── dto/                          # DTOs del módulo
│   ├── interfaces/                   # Interfaces del módulo
│   ├── services/                     # Servicios del módulo
│   ├── ollamani.controller.ts        # Controlador
│   └── ollamani.module.ts            # Módulo
├── app.controller.ts                 # Controlador principal
├── app.module.ts                     # Módulo principal
├── app.service.ts                    # Servicio principal
└── main.ts                          # Punto de entrada
```

## 🔌 API Endpoints

### Health Check
```
GET /api/v1/health
```
Respuesta:
```json
"OK!"
```

### Documentación API
La documentación completa de la API está disponible en:
```
http://localhost:3000/doc-api
```

### Versionado de API
Todas las rutas están versionadas automáticamente:
- Prefijo base: `/api`
- Versión por defecto: `v1`
- Ejemplo: `/api/v1/health`

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm run test
```

### Tests en modo watch
```bash
npm run test:watch
```

### Coverage de tests
```bash
npm run test:cov
```

### Tests e2e
```bash
npm run test:e2e
```

### Tests con debug
```bash
npm run test:debug
```

### Configuración de Jest

El proyecto incluye configuración avanzada de Jest con:
- **Mapeo de módulos** para path aliases
- **Coverage reporting** con exclusiones específicas
- **Setup files** para configuración de tests
- **Soporte TypeScript** completo

## 🐳 Docker

### Levantar servicios con Docker Compose
```bash
npm run composer-up
```

Este comando levantará los servicios definidos en `docker-compose.yaml` (MySQL, Redis, etc.)

## 🗄️ Migraciones de Base de Datos

### Generar nueva migración
```bash
npm run migration:generate -- src/_common/migrations/NombreDeMigracion
```

### Ejecutar migraciones
```bash
npm run migration:run
```

### Revertir última migración
```bash
npm run migration:revert
```

### Comando TypeORM directo
```bash
npm run typeorm -- [comando]
```

## 📝 Logging

El sistema de logging incluye:
- **Middleware de logging** para todas las requests
- **Interceptor de logging** para respuestas
- **Logger service** personalizable
- **Logs estructurados** con niveles configurables

### Niveles de Log
- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general
- `debug`: Información de debug

## 🔒 Autenticación

El proyecto incluye autenticación JWT configurada:
- **Guards personalizados** para proteger rutas
- **Decoradores** para extraer información del token
- **Configuración flexible** de expiración y secretos

## 📄 Documentación Adicional

### Archivos de Documentación
- **`modelo-datos.md`** - Documentación completa del modelo de datos
- **`seeds.sql`** - Datos semillas para inicializar la base de datos
- **`README.md`** - Documentación general del proyecto

### Recursos Importantes
- Las entidades TypeORM se encuentran en `src/_common/repository/entities/`
- Las migraciones están en `src/_common/repository/migrations/`
- La configuración de la base de datos está en `ormconfig.ts`

## 🎨 Linting y Formato

### Linting
```bash
npm run lint
```

### Formato de código
```bash
npm run format
```

### Pre-commit hooks
El proyecto incluye Husky para ejecutar automáticamente:
- Linting
- Formato de código
- Tests (opcional)

## 📊 Monitoreo

### Health Checks
- Endpoint básico de salud en `/api/v1/health`
- Configuración lista para health checks avanzados

### Métricas
El proyecto está preparado para integrar:
- Prometheus metrics
- Application Performance Monitoring (APM)
- Custom metrics

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=3000
# ... otras variables específicas de producción
```

### Build para Producción
```bash
npm run build
npm run start:prod
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Utilizar ESLint y Prettier
- Seguir convenciones de NestJS
- Escribir tests para nuevas funcionalidades
- Documentar APIs con Swagger

## 📄 Licencia

Este proyecto está bajo la Licencia UNLICENSED - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Equipo de Desarrollo** - *Trabajo inicial*

## 🙏 Agradecimientos

- NestJS team por el excelente framework
- TypeORM team por el ORM robusto
- Comunidad open source por las librerías utilizadas

---

Para más información sobre NestJS, visita [https://nestjs.com/](https://nestjs.com/)
