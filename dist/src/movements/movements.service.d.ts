import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { EmployeeRepository, IncidentRepository, MovementRepository, UserAccessRepository } from "../_common/repository";
import { UserAccessService } from "../_common/services/user-access.service";
import { UserSessionDto } from "../auth/dto/auth-response.dto";
import { CreateMovementDto, MovementResponseDto, MovementSearchDto, UpdateMovementDto } from "./dto/movement.dto";
export declare class MovementsService {
    private readonly movementRepository;
    private readonly employeeRepository;
    private readonly incidentRepository;
    private readonly userAccessService;
    private readonly userAccessRepository;
    constructor(movementRepository: MovementRepository, employeeRepository: EmployeeRepository, incidentRepository: IncidentRepository, userAccessService: UserAccessService, userAccessRepository: UserAccessRepository);
    findAll(paginationQuery: PaginationQueryDto, token: UserSessionDto): Promise<PaginatedResponseDto<MovementResponseDto>>;
    findOne(id: string, token?: UserSessionDto): Promise<MovementResponseDto>;
    create(createMovementDto: CreateMovementDto, token: UserSessionDto): Promise<MovementResponseDto>;
    update(updateMovementDto: UpdateMovementDto, token: UserSessionDto): Promise<MovementResponseDto>;
    remove(id: string, token: UserSessionDto): Promise<{
        message: string;
    }>;
    findByEmployee(employeeCode: number, token: UserSessionDto): Promise<MovementResponseDto[]>;
    findByIncident(incidentCode: string, token: UserSessionDto): Promise<MovementResponseDto[]>;
    findByStatus(status: number, token: UserSessionDto): Promise<MovementResponseDto[]>;
    findByDateRange(startDate: Date, endDate: Date, token: UserSessionDto): Promise<MovementResponseDto[]>;
    search(searchDto: MovementSearchDto, paginationQuery: PaginationQueryDto, token: UserSessionDto): Promise<PaginatedResponseDto<MovementResponseDto>>;
    getRecentMovements(limit: number, token: UserSessionDto): Promise<MovementResponseDto[]>;
    getStats(startDate?: Date, endDate?: Date, token?: UserSessionDto): Promise<any>;
    private ensureUserAccess;
    private mapToResponseDto;
}
