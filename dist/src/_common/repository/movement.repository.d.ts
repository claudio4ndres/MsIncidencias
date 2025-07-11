import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { MovementEntity } from "./entities/movement.entity";
export declare class MovementRepository {
    private movementEntity;
    constructor(movementEntity: Repository<MovementEntity>);
    findOne(criteria: FindOneOptions<MovementEntity>): Promise<MovementEntity>;
    create(payload: Partial<MovementEntity>): Promise<MovementEntity>;
    save(payload: Partial<MovementEntity>): Promise<MovementEntity>;
    update(criteria: FindOptionsWhere<MovementEntity>, payload: QueryDeepPartialEntity<MovementEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<MovementEntity>): Promise<MovementEntity[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<MovementEntity[]>;
    delete(payload: FindOptionsWhere<MovementEntity>): Promise<DeleteResult>;
    count(criteria?: FindManyOptions<MovementEntity>): Promise<number>;
}
