import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EmployeeEntity } from "./entities/employee.entity";
export declare class EmployeeRepository {
    private employeeEntity;
    constructor(employeeEntity: Repository<EmployeeEntity>);
    findOne(criteria: FindOneOptions<EmployeeEntity>): Promise<EmployeeEntity>;
    create(payload: Partial<EmployeeEntity>): Promise<EmployeeEntity>;
    save(payload: Partial<EmployeeEntity>): Promise<EmployeeEntity>;
    update(criteria: FindOptionsWhere<EmployeeEntity>, payload: QueryDeepPartialEntity<EmployeeEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<EmployeeEntity>): Promise<EmployeeEntity[]>;
    delete(payload: FindOptionsWhere<EmployeeEntity>): Promise<DeleteResult>;
    count(options?: FindManyOptions<EmployeeEntity>): Promise<number>;
}
