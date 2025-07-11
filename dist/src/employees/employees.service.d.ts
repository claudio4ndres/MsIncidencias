import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { EmployeeRepository } from "../_common/repository";
import { CreateEmployeeDto, EmployeeResponseDto, UpdateEmployeeDto } from "./dto/employee.dto";
export declare class EmployeesService {
    private readonly employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<EmployeeResponseDto>>;
    findOne(id: string): Promise<EmployeeResponseDto>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
    update(updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
