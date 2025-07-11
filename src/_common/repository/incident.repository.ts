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
import { IncidentEntity } from "./entities/incident.entity";

@Injectable()
export class IncidentRepository {
  constructor(
    @InjectRepository(IncidentEntity)
    private incidentEntity: Repository<IncidentEntity>
  ) {}

  async findOne(criteria: FindOneOptions<IncidentEntity>): Promise<IncidentEntity> {
    return this.incidentEntity.findOne(criteria);
  }

  async create(payload: Partial<IncidentEntity>): Promise<IncidentEntity> {
    return this.incidentEntity.create(payload);
  }

  async save(payload: Partial<IncidentEntity>): Promise<IncidentEntity> {
    return this.incidentEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<IncidentEntity>,
    payload: QueryDeepPartialEntity<IncidentEntity>
  ): Promise<UpdateResult> {
    return this.incidentEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<IncidentEntity>): Promise<IncidentEntity[]> {
    return this.incidentEntity.find(payload);
  }

  async delete(payload: FindOptionsWhere<IncidentEntity>): Promise<DeleteResult> {
    return this.incidentEntity.delete(payload);
  }

  async count(criteria?: FindManyOptions<IncidentEntity>): Promise<number> {
    return this.incidentEntity.count(criteria);
  }
}
