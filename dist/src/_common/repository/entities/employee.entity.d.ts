import { OfficeEntity } from './office.entity';
import { MovementEntity } from './movement.entity';
export declare class EmployeeEntity {
    id: string;
    officeId: string;
    employeeCode: number;
    employeeName: string;
    employeeType: string;
    employeeStatus: number;
    createdAt: Date;
    updatedAt: Date;
    office: OfficeEntity;
    movements: MovementEntity[];
}
