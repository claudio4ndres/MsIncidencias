import { IAccessToken } from "@src/_common/interfaces";
import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { UserSessionDto } from "../auth/dto/auth-response.dto";
import { CreateMovementDto, DeleteMovementDto, MovementResponseDto, MovementSearchDto, UpdateMovementDto } from "./dto/movement.dto";
import { MovementsService } from "./movements.service";
export declare class MovementsController {
    private readonly movementsService;
    constructor(movementsService: MovementsService);
    private convertTokenToUserSession;
    findAll(paginationQuery: PaginationQueryDto, token: UserSessionDto): Promise<PaginatedResponseDto<MovementResponseDto>>;
    search(searchDto: MovementSearchDto, paginationQuery: PaginationQueryDto, token: IAccessToken): Promise<PaginatedResponseDto<MovementResponseDto>>;
    getStats(startDate?: string, endDate?: string, token?: IAccessToken): Promise<any>;
    getRecent(limit?: string, token?: IAccessToken): Promise<MovementResponseDto[]>;
    findByEmployee(employeeCode: string, token: IAccessToken): Promise<MovementResponseDto[]>;
    findByIncident(incidentCode: string, token: IAccessToken): Promise<MovementResponseDto[]>;
    findByDateRange(startDate: string, endDate: string, token: IAccessToken): Promise<MovementResponseDto[]>;
    findOne(id: string, token: IAccessToken): Promise<MovementResponseDto>;
    create(createMovementDto: CreateMovementDto, token: IAccessToken): Promise<MovementResponseDto>;
    update(updateMovementDto: UpdateMovementDto, token: IAccessToken): Promise<MovementResponseDto>;
    remove(deleteMovementDto: DeleteMovementDto, token: IAccessToken): Promise<{
        message: string;
    }>;
}
