"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.local' });
}
else {
    dotenv.config({ path: '.env' });
}
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'ms_incidencias',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        'src/_common/repository/entities/**/*.entity.ts',
        'src/_common/repository/entities/*.entity.ts'
    ],
    migrations: ['src/_common/migrations/*.ts', 'src/_common/repository/migrations/*.ts'],
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
});
//# sourceMappingURL=ormconfig.js.map