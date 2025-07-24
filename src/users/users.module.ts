import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity, UserRepository } from "../_common/repository";
import { UserAccessEntity } from "../_common/repository/entities/user-access.entity";
import { UserAccessRepository } from "../_common/repository/user-access.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAccessEntity]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserAccessRepository],
  exports: [UsersService],
})
export class UsersModule {}
