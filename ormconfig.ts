import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config({ path: '.env' });
}

export default new DataSource({
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
