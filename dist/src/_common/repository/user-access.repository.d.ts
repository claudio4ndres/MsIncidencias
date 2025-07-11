import { Repository } from "typeorm";
import { UserAccessEntity } from "./entities/user-access.entity";
export declare class UserAccessRepository {
    private readonly repository;
    constructor(repository: Repository<UserAccessEntity>);
    findByUserId(userId: string): Promise<UserAccessEntity[]>;
    findByUserIdAndCompany(userId: string, companyId: string): Promise<UserAccessEntity[]>;
    findByUserIdAndOffice(userId: string, officeId: string): Promise<UserAccessEntity | null>;
    hasAccessToCompany(userId: string, companyId: string): Promise<boolean>;
    hasAccessToOffice(userId: string, officeId: string): Promise<boolean>;
    getAccessibleCompanies(userId: string): Promise<string[]>;
    getAccessibleOffices(userId: string): Promise<string[]>;
    save(userAccess: Partial<UserAccessEntity>): Promise<UserAccessEntity>;
}
