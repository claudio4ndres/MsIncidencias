import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { IncidentEntity } from "./entities/incident.entity";
export declare class IncidentRepository {
    private incidentEntity;
    constructor(incidentEntity: Repository<IncidentEntity>);
    findOne(criteria: FindOneOptions<IncidentEntity>): Promise<IncidentEntity>;
    create(payload: Partial<IncidentEntity>): Promise<IncidentEntity>;
    save(payload: Partial<IncidentEntity>): Promise<IncidentEntity>;
    update(criteria: FindOptionsWhere<IncidentEntity>, payload: QueryDeepPartialEntity<IncidentEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<IncidentEntity>): Promise<IncidentEntity[]>;
    delete(payload: FindOptionsWhere<IncidentEntity>): Promise<DeleteResult>;
    count(criteria?: FindManyOptions<IncidentEntity>): Promise<number>;
}
