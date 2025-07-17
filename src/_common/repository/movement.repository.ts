import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { MovementEntity } from "./entities/movement.entity";

@Injectable()
export class MovementRepository {
  constructor(
    @InjectRepository(MovementEntity)
    private movementEntity: Repository<MovementEntity>
  ) {}

  async findOne(criteria: FindOneOptions<MovementEntity>): Promise<MovementEntity> {
    return this.movementEntity.findOne(criteria);
  }

  async create(payload: Partial<MovementEntity>): Promise<MovementEntity> {
    return this.movementEntity.create(payload);
  }

  async save(payload: Partial<MovementEntity>): Promise<MovementEntity> {
    return this.movementEntity.save(payload);
  }

  async update(
    criteria: FindOptionsWhere<MovementEntity>,
    payload: QueryDeepPartialEntity<MovementEntity>
  ): Promise<UpdateResult> {
    return this.movementEntity.update(criteria, payload);
  }

  async find(payload: FindManyOptions<MovementEntity>): Promise<MovementEntity[]> {
    return this.movementEntity.find(payload);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<MovementEntity[]> {
    return this.movementEntity.find({
      where: {
        incidenceDate: Between(startDate, endDate),
      },
      relations: ["employee", "incident"]
    });
  }

  async findByDateRangeForCSV(startDate: Date, endDate: Date): Promise<MovementEntity[]> {
    return this.movementEntity
      .createQueryBuilder('movement')
      .leftJoin('movement.employee', 'employee')
      .leftJoin('movement.incident', 'incident')
      .select([
        'movement.id',
        'movement.employeeCode',
        'movement.incidentCode',
        'movement.incidenceDate',
        'movement.incidenceObservation',
        'movement.incidenceStatus',
        'employee.employeeCode',
        'employee.employeeName',
        'employee.employeeType',
        'employee.employeeStatus',
        'incident.incidentCode',
        'incident.incidentName',
        'incident.incidentStatus'
      ])
      .where('movement.incidenceDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .getMany();
  }

  async delete(payload: FindOptionsWhere<MovementEntity>): Promise<DeleteResult> {
    return this.movementEntity.delete(payload);
  }

  async count(criteria?: FindManyOptions<MovementEntity>): Promise<number> {
    return this.movementEntity.count(criteria);
  }
}
