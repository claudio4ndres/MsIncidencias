import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MsOllamaniEntity } from "../entities/ms-ollamani.entity";
import { createTypeOrmConfig } from "./typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([MsOllamaniEntity]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
