import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { IncidentRepository } from "../_common/repository";
import { CreateIncidentDto, IncidentResponseDto, UpdateIncidentDto } from "./dto/incident.dto";
export declare class IncidentsService {
    private readonly incidentRepository;
    constructor(incidentRepository: IncidentRepository);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<IncidentResponseDto>>;
    findOne(id: string): Promise<IncidentResponseDto>;
    create(createIncidentDto: CreateIncidentDto): Promise<IncidentResponseDto>;
    update(updateIncidentDto: UpdateIncidentDto): Promise<IncidentResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByStatus(status: number): Promise<IncidentResponseDto[]>;
    findByCode(code: string): Promise<IncidentResponseDto>;
    findWithMovements(id: string): Promise<IncidentResponseDto>;
    getStats(): Promise<any>;
    private mapToResponseDto;
}
