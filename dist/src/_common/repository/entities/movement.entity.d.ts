import { EmployeeEntity } from './employee.entity';
import { IncidentEntity } from './incident.entity';
export declare class MovementEntity {
    id: string;
    employeeCode: number;
    incidentCode: string;
    incidenceDate: Date;
    incidenceObservation: string;
    incidenceStatus: number;
    createdAt: Date;
    updatedAt: Date;
    employee: EmployeeEntity;
    incident: IncidentEntity;
}
