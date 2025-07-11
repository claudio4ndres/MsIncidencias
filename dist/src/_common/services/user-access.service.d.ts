import { UserSessionDto } from "../../auth/dto/auth-response.dto";
import { UserAccessRepository } from "../repository/user-access.repository";
export declare class UserAccessService {
    private readonly userAccessRepository;
    constructor(userAccessRepository: UserAccessRepository);
    getAccessibleCompanies(userId: string): Promise<string[]>;
    getAccessibleOffices(userId: string): Promise<string[]>;
    hasAccessToCompany(userId: string, companyId: string): Promise<boolean>;
    hasAccessToOffice(userId: string, officeId: string): Promise<boolean>;
    buildOfficeFilter(token: UserSessionDto): Promise<any>;
    buildCompanyFilter(token: UserSessionDto): Promise<any>;
    validateAccess(token: UserSessionDto, companyId?: string, officeId?: string): Promise<boolean>;
}
