import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare const createDatabaseConfig: (configService: ConfigService) => DataSource;
