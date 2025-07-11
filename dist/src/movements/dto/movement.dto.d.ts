export declare class CreateMovementDto {
    employee_code: number;
    incident_code: string;
    incidence_date: string;
    incidence_observation: string;
    incidence_status?: number;
}
declare const UpdateMovementDto_base: import("@nestjs/common").Type<Partial<CreateMovementDto>>;
export declare class UpdateMovementDto extends UpdateMovementDto_base {
    id: string;
}
export declare class MovementResponseDto {
    id: string;
    employee_code: number;
    incident_code: string;
    incidence_date: Date;
    incidence_observation: string;
    incidence_status: number;
    created_at: Date;
    updated_at: Date;
    employee?: {
        id: string;
        employee_name: string;
        employee_type: string;
    };
    incident?: {
        id: string;
        incident_name: string;
        incident_status: number;
    };
}
export declare class DeleteMovementDto {
    id: string;
}
export declare class MovementSearchDto {
    employee_code?: number;
    incident_code?: string;
    incidence_status?: number;
    start_date?: string;
    end_date?: string;
}
export {};
