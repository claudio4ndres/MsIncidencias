export declare class CreateOfficeDto {
    company_id: string;
    office_name: string;
    office_status?: number;
}
declare const UpdateOfficeDto_base: import("@nestjs/common").Type<Partial<CreateOfficeDto>>;
export declare class UpdateOfficeDto extends UpdateOfficeDto_base {
    id: string;
}
export declare class OfficeResponseDto {
    id: string;
    company_id: string;
    company_name: string;
    office_name: string;
    office_status: number;
    created_at: Date;
    updated_at: Date;
}
export declare class DeleteOfficeDto {
    id: string;
}
export {};
