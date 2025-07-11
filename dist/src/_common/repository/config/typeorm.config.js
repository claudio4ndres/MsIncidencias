"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.createTypeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const calendar_entity_1 = require("../entities/calendar.entity");
const company_entity_1 = require("../entities/company.entity");
const employee_entity_1 = require("../entities/employee.entity");
const incident_entity_1 = require("../entities/incident.entity");
const movement_entity_1 = require("../entities/movement.entity");
const ms_ollamani_entity_1 = require("../entities/ms-ollamani.entity");
const office_entity_1 = require("../entities/office.entity");
const user_entity_1 = require("../entities/user.entity");
const user_access_entity_1 = require("../entities/user-access.entity");
const createTypeOrmConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST') || 'localhost',
    port: parseInt(configService.get('DB_PORT')) || 3306,
    username: configService.get('DB_USERNAME') || 'root',
    password: configService.get('DB_PASSWORD') || 'password',
    database: configService.get('DB_DATABASE') || 'nestjs_db',
    entities: [
        calendar_entity_1.Calendar,
        company_entity_1.CompanyEntity,
        employee_entity_1.EmployeeEntity,
        incident_entity_1.IncidentEntity,
        movement_entity_1.MovementEntity,
        ms_ollamani_entity_1.MsOllamaniEntity,
        office_entity_1.OfficeEntity,
        user_entity_1.UserEntity,
        user_access_entity_1.UserAccessEntity
    ],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
});
exports.createTypeOrmConfig = createTypeOrmConfig;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nestjs_db',
    entities: [
        calendar_entity_1.Calendar,
        company_entity_1.CompanyEntity,
        employee_entity_1.EmployeeEntity,
        incident_entity_1.IncidentEntity,
        movement_entity_1.MovementEntity,
        ms_ollamani_entity_1.MsOllamaniEntity,
        office_entity_1.OfficeEntity,
        user_entity_1.UserEntity,
        user_access_entity_1.UserAccessEntity
    ],
    migrations: [__dirname + '/../migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
});
//# sourceMappingURL=typeorm.config.js.map