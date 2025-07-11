import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity, UserRepository } from '../_common/repository';
import { JwtAuthGuard } from '../_common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    JwtAuthGuard,
  ],
  exports: [UsersService],
})
export class UsersModule {}
