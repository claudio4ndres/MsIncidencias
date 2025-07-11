import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { CompanyRepository } from "../_common/repository";
import { CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto } from "./dto/company.dto";
export declare class CompaniesService {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<CompanyResponseDto>>;
    findOne(id: string): Promise<CompanyResponseDto>;
    create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto>;
    update(updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByStatus(status: number): Promise<CompanyResponseDto[]>;
    findWithOffices(id: string): Promise<CompanyResponseDto>;
    findWithUsers(id: string): Promise<CompanyResponseDto>;
}
