import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CompanyEntity } from "./entities/company.entity";
export declare class CompanyRepository {
    private companyEntity;
    constructor(companyEntity: Repository<CompanyEntity>);
    findOne(criteria: FindOneOptions<CompanyEntity>): Promise<CompanyEntity>;
    create(payload: Partial<CompanyEntity>): Promise<CompanyEntity>;
    save(payload: Partial<CompanyEntity>): Promise<CompanyEntity>;
    update(criteria: FindOptionsWhere<CompanyEntity>, payload: QueryDeepPartialEntity<CompanyEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<CompanyEntity>): Promise<CompanyEntity[]>;
    delete(payload: FindOptionsWhere<CompanyEntity>): Promise<DeleteResult>;
    count(options?: FindManyOptions<CompanyEntity>): Promise<number>;
    findByStatus(status: number): Promise<CompanyEntity[]>;
    findByName(name: string): Promise<CompanyEntity>;
    findWithOffices(id: string): Promise<CompanyEntity>;
    findWithUsers(id: string): Promise<CompanyEntity>;
}
