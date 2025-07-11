import { OfficeEntity } from '../../_common/repository/entities/office.entity';
import { OfficeResponseDto } from '../dto/office.dto';
export declare class OfficeMapper {
    static toResponseDto(entity: OfficeEntity): OfficeResponseDto;
    static toResponseDtoArray(entities: OfficeEntity[]): OfficeResponseDto[];
}
