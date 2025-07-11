import { CompanyEntity } from './company.entity';
import { EmployeeEntity } from './employee.entity';
import { UserAccessEntity } from './user-access.entity';
export declare class OfficeEntity {
    id: string;
    companyId: string;
    officeName: string;
    officeStatus: number;
    createdAt: Date;
    updatedAt: Date;
    company: CompanyEntity;
    employees: EmployeeEntity[];
    userAccess: UserAccessEntity[];
}
