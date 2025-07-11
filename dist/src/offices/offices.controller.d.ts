import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { CreateOfficeDto, DeleteOfficeDto, OfficeResponseDto, UpdateOfficeDto } from "./dto/office.dto";
import { OfficesService } from "./offices.service";
export declare class OfficesController {
    private readonly officesService;
    constructor(officesService: OfficesService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<OfficeResponseDto>>;
    findOne(id: string): Promise<OfficeResponseDto>;
    create(createOfficeDto: CreateOfficeDto): Promise<OfficeResponseDto>;
    update(updateOfficeDto: UpdateOfficeDto): Promise<OfficeResponseDto>;
    remove(deleteOfficeDto: DeleteOfficeDto): Promise<{
        message: string;
    }>;
}
