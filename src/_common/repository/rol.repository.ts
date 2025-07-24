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
import { RolEntity } from "./entities/rol.entity";

@Injectable()
export class RolRepository {
  constructor(
    @InjectRepository(RolEntity)
    private rolEntity: Repository<RolEntity>
  ) {}

  async findOne(criteria: FindOneOptions<RolEntity>): Promise<RolEntity> {
    return this.rolEntity.findOne(criteria);
  }

  async create(payload: Partial<RolEntity>): Promise<RolEntity> {
    return this.rolEntity.create(payload);
  }

  async save(payload: Partial<RolEntity>): Promise<RolEntity> {
    return this.rolEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<RolEntity>,
    payload: QueryDeepPartialEntity<RolEntity>
  ): Promise<UpdateResult> {
    return this.rolEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<RolEntity>): Promise<RolEntity[]> {
    return this.rolEntity.find(payload);
  }

  async delete(payload: FindOptionsWhere<RolEntity>): Promise<DeleteResult> {
    return this.rolEntity.delete(payload);
  }

  async count(criteria?: FindManyOptions<RolEntity>): Promise<number> {
    return this.rolEntity.count(criteria);
  }
}
