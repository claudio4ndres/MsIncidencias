import { EmployeeEntity } from '../../_common/repository/entities/employee.entity';
import { EmployeeResponseDto } from '../dto/employee.dto';
export declare class EmployeeMapper {
    static toResponseDto(entity: EmployeeEntity): EmployeeResponseDto;
    static toResponseDtoArray(entities: EmployeeEntity[]): EmployeeResponseDto[];
}
