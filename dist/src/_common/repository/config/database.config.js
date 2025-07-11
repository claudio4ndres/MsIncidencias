"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConfig = void 0;
const typeorm_1 = require("typeorm");
const createDatabaseConfig = (configService) => {
    return new typeorm_1.DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'password',
        database: configService.get('DB_NAME') || 'nestjs_db',
        entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    });
};
exports.createDatabaseConfig = createDatabaseConfig;
//# sourceMappingURL=database.config.js.map