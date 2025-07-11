import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { CompaniesService } from "./companies.service";
import { CompanyResponseDto, CreateCompanyDto, DeleteCompanyDto, UpdateCompanyDto } from "./dto/company.dto";
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<CompanyResponseDto>>;
    findOne(id: string): Promise<CompanyResponseDto>;
    create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto>;
    update(updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto>;
    remove(deleteCompanyDto: DeleteCompanyDto): Promise<{
        message: string;
    }>;
    findByStatus(status: string): Promise<CompanyResponseDto[]>;
    findWithOffices(id: string): Promise<CompanyResponseDto>;
    findWithUsers(id: string): Promise<CompanyResponseDto>;
}
