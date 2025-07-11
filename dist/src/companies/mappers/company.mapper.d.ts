import { CompanyEntity } from '../../_common/repository/entities/company.entity';
import { CompanyResponseDto } from '../dto/company.dto';
export declare class CompanyMapper {
    static toResponseDto(entity: CompanyEntity): CompanyResponseDto;
    static toResponseDtoArray(entities: CompanyEntity[]): CompanyResponseDto[];
}
