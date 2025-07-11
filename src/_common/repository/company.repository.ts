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
import { CompanyEntity } from "./entities/company.entity";

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyEntity: Repository<CompanyEntity>
  ) {}

  async findOne(
    criteria: FindOneOptions<CompanyEntity>
  ): Promise<CompanyEntity> {
    return this.companyEntity.findOne(criteria);
  }

  async create(payload: Partial<CompanyEntity>): Promise<CompanyEntity> {
    return this.companyEntity.create(payload);
  }

  async save(payload: Partial<CompanyEntity>): Promise<CompanyEntity> {
    return this.companyEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<CompanyEntity>,
    payload: QueryDeepPartialEntity<CompanyEntity>
  ): Promise<UpdateResult> {
    return this.companyEntity.update(criteria, payload);
  }

  async find(
    payload: FindManyOptions<CompanyEntity>
  ): Promise<CompanyEntity[]> {
    return this.companyEntity.find(payload);
  }

  async delete(
    payload: FindOptionsWhere<CompanyEntity>
  ): Promise<DeleteResult> {
    return this.companyEntity.delete(payload);
  }

  async count(
    options?: FindManyOptions<CompanyEntity>
  ): Promise<number> {
    return this.companyEntity.count(options);
  }

  async findByStatus(status: number): Promise<CompanyEntity[]> {
    return this.companyEntity.find({
      where: { companyStatus: status }
    });
  }

  async findByName(name: string): Promise<CompanyEntity> {
    return this.companyEntity.findOne({
      where: { companyName: name }
    });
  }

  async findWithOffices(id: string): Promise<CompanyEntity> {
    return this.companyEntity.findOne({
      where: { id },
      relations: ['offices']
    });
  }

  async findWithUsers(id: string): Promise<CompanyEntity> {
    return this.companyEntity.findOne({
      where: { id },
      relations: ['users']
    });
  }
}
