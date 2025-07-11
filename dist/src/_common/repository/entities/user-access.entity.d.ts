import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';
import { OfficeEntity } from './office.entity';
export declare class UserAccessEntity {
    id: number;
    userId: string;
    companyId: string;
    officeId: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
    company: CompanyEntity;
    office: OfficeEntity;
}
