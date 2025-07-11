import { OfficeEntity } from './office.entity';
import { UserAccessEntity } from './user-access.entity';
export declare class CompanyEntity {
    id: string;
    companyName: string;
    companyStatus: number;
    createdAt: Date;
    updatedAt: Date;
    offices: OfficeEntity[];
    userAccess: UserAccessEntity[];
}
