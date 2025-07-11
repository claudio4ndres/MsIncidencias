import { CompanyEntity } from '../../_common/repository/entities/company.entity';
import { CompanyResponseDto } from '../dto/company.dto';

export class CompanyMapper {
  static toResponseDto(entity: CompanyEntity): CompanyResponseDto {
    const dto = new CompanyResponseDto();
    dto.id = entity.id;
    dto.company_name = entity.companyName;
    dto.company_status = entity.companyStatus;
    dto.created_at = entity.createdAt;
    dto.updated_at = entity.updatedAt;
    return dto;
  }

  static toResponseDtoArray(entities: CompanyEntity[]): CompanyResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}
