import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { CreateEmployeeDto, DeleteEmployeeDto, EmployeeResponseDto, UpdateEmployeeDto } from "./dto/employee.dto";
import { EmployeesService } from "./employees.service";
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<EmployeeResponseDto>>;
    findOne(id: string): Promise<EmployeeResponseDto>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
    update(updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto>;
    remove(deleteEmployeeDto: DeleteEmployeeDto): Promise<{
        message: string;
    }>;
}
