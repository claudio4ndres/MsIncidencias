import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { OfficeRepository } from "../_common/repository";
import { CreateOfficeDto, OfficeResponseDto, UpdateOfficeDto } from "./dto/office.dto";
export declare class OfficesService {
    private readonly officeRepository;
    constructor(officeRepository: OfficeRepository);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<OfficeResponseDto>>;
    findOne(id: string): Promise<OfficeResponseDto>;
    create(createOfficeDto: CreateOfficeDto): Promise<OfficeResponseDto>;
    update(updateOfficeDto: UpdateOfficeDto): Promise<OfficeResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
