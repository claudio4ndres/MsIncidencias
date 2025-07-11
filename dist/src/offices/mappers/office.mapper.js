"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeMapper = void 0;
const office_dto_1 = require("../dto/office.dto");
class OfficeMapper {
    static toResponseDto(entity) {
        const dto = new office_dto_1.OfficeResponseDto();
        dto.id = entity.id;
        dto.company_id = entity.companyId;
        dto.company_name = entity.company?.companyName || null;
        dto.office_name = entity.officeName;
        dto.office_status = entity.officeStatus;
        dto.created_at = entity.createdAt;
        dto.updated_at = entity.updatedAt;
        return dto;
    }
    static toResponseDtoArray(entities) {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
exports.OfficeMapper = OfficeMapper;
//# sourceMappingURL=office.mapper.js.map