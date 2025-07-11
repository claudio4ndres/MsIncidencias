import { EmployeeEntity } from '../../_common/repository/entities/employee.entity';
import { EmployeeResponseDto } from '../dto/employee.dto';

export class EmployeeMapper {
  static toResponseDto(entity: EmployeeEntity): EmployeeResponseDto {
    const dto = new EmployeeResponseDto();
    dto.id = entity.id;
    dto.office_id = entity.officeId;
    dto.employee_code = entity.employeeCode;
    dto.employee_name = entity.employeeName;
    dto.employee_type = entity.employeeType;
    dto.employee_status = entity.employeeStatus;
    dto.created_at = entity.createdAt;
    dto.updated_at = entity.updatedAt;
    return dto;
  }

  static toResponseDtoArray(entities: EmployeeEntity[]): EmployeeResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}
