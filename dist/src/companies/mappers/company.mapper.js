"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyMapper = void 0;
const company_dto_1 = require("../dto/company.dto");
class CompanyMapper {
    static toResponseDto(entity) {
        const dto = new company_dto_1.CompanyResponseDto();
        dto.id = entity.id;
        dto.company_name = entity.companyName;
        dto.company_status = entity.companyStatus;
        dto.created_at = entity.createdAt;
        dto.updated_at = entity.updatedAt;
        return dto;
    }
    static toResponseDtoArray(entities) {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
exports.CompanyMapper = CompanyMapper;
//# sourceMappingURL=company.mapper.js.map