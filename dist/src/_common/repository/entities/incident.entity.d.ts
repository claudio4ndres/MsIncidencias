import { MovementEntity } from './movement.entity';
export declare class IncidentEntity {
    id: string;
    incidentCode: string;
    incidentName: string;
    incidentStatus: number;
    createdAt: Date;
    updatedAt: Date;
    movements: MovementEntity[];
}
