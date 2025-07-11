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
import { OfficeEntity } from "./entities/office.entity";

@Injectable()
export class OfficeRepository {
  constructor(
    @InjectRepository(OfficeEntity)
    private officeEntity: Repository<OfficeEntity>
  ) {}

  async findOne(criteria: FindOneOptions<OfficeEntity>): Promise<OfficeEntity> {
    return this.officeEntity.findOne(criteria);
  }

  async create(payload: Partial<OfficeEntity>): Promise<OfficeEntity> {
    return this.officeEntity.create(payload);
  }

  async save(payload: Partial<OfficeEntity>): Promise<OfficeEntity> {
    return this.officeEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<OfficeEntity>,
    payload: QueryDeepPartialEntity<OfficeEntity>
  ): Promise<UpdateResult> {
    return this.officeEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<OfficeEntity>): Promise<OfficeEntity[]> {
    return this.officeEntity.find(payload);
  }

  async delete(
    payload: FindOptionsWhere<OfficeEntity>
  ): Promise<DeleteResult> {
    return this.officeEntity.delete(payload);
  }

  async count(
    options?: FindManyOptions<OfficeEntity>
  ): Promise<number> {
    return this.officeEntity.count(options);
  }
}
