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
import { EmployeeEntity } from "./entities/employee.entity";

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeEntity: Repository<EmployeeEntity>
  ) {}

  async findOne(criteria: FindOneOptions<EmployeeEntity>): Promise<EmployeeEntity> {
    return this.employeeEntity.findOne(criteria);
  }

  async create(payload: Partial<EmployeeEntity>): Promise<EmployeeEntity> {
    return this.employeeEntity.create(payload);
  }

  async save(payload: Partial<EmployeeEntity>): Promise<EmployeeEntity> {
    return this.employeeEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<EmployeeEntity>,
    payload: QueryDeepPartialEntity<EmployeeEntity>
  ): Promise<UpdateResult> {
    return this.employeeEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<EmployeeEntity>): Promise<EmployeeEntity[]> {
    return this.employeeEntity.find(payload);
  }

  async delete(
    payload: FindOptionsWhere<EmployeeEntity>
  ): Promise<DeleteResult> {
    return this.employeeEntity.delete(payload);
  }

  async count(
    options?: FindManyOptions<EmployeeEntity>
  ): Promise<number> {
    return this.employeeEntity.count(options);
  }
}
