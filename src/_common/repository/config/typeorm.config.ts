import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Calendar } from '../entities/calendar.entity';
import { CompanyEntity } from '../entities/company.entity';
import { EmployeeEntity } from '../entities/employee.entity';
import { IncidentEntity } from '../entities/incident.entity';
import { MovementEntity } from '../entities/movement.entity';
import { MsOllamaniEntity } from '../entities/ms-ollamani.entity';
import { OfficeEntity } from '../entities/office.entity';
import { UserEntity } from '../entities/user.entity';
import { UserAccessEntity } from '../entities/user-access.entity';

export const createTypeOrmConfig = (configService: ConfigService) => ({
  type: 'mysql' as const,
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT')) || 3306,
  username: configService.get('DB_USERNAME') || 'root',
  password: configService.get('DB_PASSWORD') || 'password',
  database: configService.get('DB_DATABASE') || 'nestjs_db',
  entities: [
    Calendar,
    CompanyEntity,
    EmployeeEntity,
    IncidentEntity,
    MovementEntity,
    MsOllamaniEntity,
    OfficeEntity,
    UserEntity,
    UserAccessEntity
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
  migrationsRun: false,
  migrationsTableName: 'typeorm_migrations',
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [
    Calendar,
    CompanyEntity,
    EmployeeEntity,
    IncidentEntity,
    MovementEntity,
    MsOllamaniEntity,
    OfficeEntity,
    UserEntity,
    UserAccessEntity
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
