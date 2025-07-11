import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { CreateIncidentDto, DeleteIncidentDto, IncidentResponseDto, UpdateIncidentDto } from "./dto/incident.dto";
import { IncidentsService } from "./incidents.service";
export declare class IncidentsController {
    private readonly incidentsService;
    constructor(incidentsService: IncidentsService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<IncidentResponseDto>>;
    getStats(): Promise<any>;
    findByStatus(status: string): Promise<IncidentResponseDto[]>;
    findByCode(code: string): Promise<IncidentResponseDto>;
    findOne(id: string): Promise<IncidentResponseDto>;
    findWithMovements(id: string): Promise<IncidentResponseDto>;
    create(createIncidentDto: CreateIncidentDto): Promise<IncidentResponseDto>;
    update(updateIncidentDto: UpdateIncidentDto): Promise<IncidentResponseDto>;
    remove(deleteIncidentDto: DeleteIncidentDto): Promise<{
        message: string;
    }>;
}
