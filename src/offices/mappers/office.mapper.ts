import { OfficeEntity } from '../../_common/repository/entities/office.entity';
import { OfficeResponseDto } from '../dto/office.dto';

export class OfficeMapper {
  static toResponseDto(entity: OfficeEntity): OfficeResponseDto {
    const dto = new OfficeResponseDto();
    dto.id = entity.id;
    dto.company_id = entity.companyId;
    dto.company_name = entity.company?.companyName || null;
    dto.office_name = entity.officeName;
    dto.office_status = entity.officeStatus;
    dto.created_at = entity.createdAt;
    dto.updated_at = entity.updatedAt;
    return dto;
  }

  static toResponseDtoArray(entities: OfficeEntity[]): OfficeResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }
}
