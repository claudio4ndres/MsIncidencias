import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UserEntity } from "./entities/user.entity";
export declare class UserRepository {
    private userEntity;
    constructor(userEntity: Repository<UserEntity>);
    findOne(criteria: FindOneOptions<UserEntity>): Promise<UserEntity>;
    create(payload: Partial<UserEntity>): Promise<UserEntity>;
    save(payload: Partial<UserEntity>): Promise<UserEntity>;
    update(criteria: FindOptionsWhere<UserEntity>, payload: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult>;
    find(payload: FindManyOptions<UserEntity>): Promise<UserEntity[]>;
    delete(payload: FindOptionsWhere<UserEntity>): Promise<DeleteResult>;
    count(criteria?: FindManyOptions<UserEntity>): Promise<number>;
}
