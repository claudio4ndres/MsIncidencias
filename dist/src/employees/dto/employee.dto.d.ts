export declare class CreateEmployeeDto {
    office_id: string;
    employee_code: number;
    employee_name: string;
    employee_type: string;
    employee_status?: number;
}
declare const UpdateEmployeeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeDto>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
    id: string;
}
export declare class EmployeeResponseDto {
    id: string;
    office_id: string;
    employee_code: number;
    employee_name: string;
    employee_type: string;
    employee_status: number;
    created_at: Date;
    updated_at: Date;
}
export declare class DeleteEmployeeDto {
    id: string;
}
export {};
