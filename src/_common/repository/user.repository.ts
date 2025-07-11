import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>
  ) {}

  async findOne(criteria: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userEntity.findOne(criteria);
  }

  async create(payload: Partial<UserEntity>): Promise<UserEntity> {
    return this.userEntity.create(payload);
  }

  async save(payload: Partial<UserEntity>): Promise<UserEntity> {
    return this.userEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<UserEntity>,
    payload: QueryDeepPartialEntity<UserEntity>
  ): Promise<UpdateResult> {
    return this.userEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userEntity.find(payload);
  }

  async delete(payload: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    return this.userEntity.delete(payload);
  }

  async count(criteria?: FindManyOptions<UserEntity>): Promise<number> {
    return this.userEntity.count(criteria);
  }
}
