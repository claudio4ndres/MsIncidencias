export declare class CreateCompanyDto {
    company_name: string;
    company_status: number;
}
declare const UpdateCompanyDto_base: import("@nestjs/common").Type<Partial<CreateCompanyDto>>;
export declare class UpdateCompanyDto extends UpdateCompanyDto_base {
    id: string;
}
export declare class CompanyResponseDto {
    id: string;
    company_name: string;
    company_status: number;
    created_at: Date;
    updated_at: Date;
}
export declare class DeleteCompanyDto {
    id: string;
}
export {};
