import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { OfficeEntity } from "./entities/office.entity";
export declare class OfficeRepository {
    private officeEntity;
    constructor(officeEntity: Repository<OfficeEntity>);
    findOne(criteria: FindOneOptions<OfficeEntity>): Promise<OfficeEntity>;
    create(payload: Partial<OfficeEntity>): Promise<OfficeEntity>;
    save(payload: Partial<OfficeEntity>): Promise<OfficeEntity>;
    update(criteria: FindOptionsWhere<OfficeEntity>, payload: QueryDeepPartialEntity<OfficeEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<OfficeEntity>): Promise<OfficeEntity[]>;
    delete(payload: FindOptionsWhere<OfficeEntity>): Promise<DeleteResult>;
    count(options?: FindManyOptions<OfficeEntity>): Promise<number>;
}
