"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeMapper = void 0;
const employee_dto_1 = require("../dto/employee.dto");
class EmployeeMapper {
    static toResponseDto(entity) {
        const dto = new employee_dto_1.EmployeeResponseDto();
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
    static toResponseDtoArray(entities) {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
exports.EmployeeMapper = EmployeeMapper;
//# sourceMappingURL=employee.mapper.js.map