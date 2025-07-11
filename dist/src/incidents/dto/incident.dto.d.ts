export declare class CreateIncidentDto {
    incident_code: string;
    incident_name: string;
    incident_status?: number;
}
declare const UpdateIncidentDto_base: import("@nestjs/common").Type<Partial<CreateIncidentDto>>;
export declare class UpdateIncidentDto extends UpdateIncidentDto_base {
    id: string;
}
export declare class IncidentResponseDto {
    id: string;
    incident_code: string;
    incident_name: string;
    incident_status: number;
    created_at: Date;
    updated_at: Date;
}
export declare class DeleteIncidentDto {
    id: string;
}
export {};
