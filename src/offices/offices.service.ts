import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { OfficeRepository } from "../_common/repository";
import {
  CreateOfficeDto,
  OfficeResponseDto,
  UpdateOfficeDto,
} from "./dto/office.dto";
import { OfficeMapper } from "./mappers/office.mapper";
@Injectable()
export class OfficesService {
  constructor(private readonly officeRepository: OfficeRepository) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<OfficeResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition = search ? { officeName: Like(`%${search}%`) } : {};

      const [offices, total] = await Promise.all([
        this.officeRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { createdAt: "DESC" },
          relations: ["company"],
        }),
        this.officeRepository.count({ where: whereCondition }),
      ]);
      const officesDto = OfficeMapper.toResponseDtoArray(offices);
      return new PaginatedResponseDto(officesDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener las oficinas");
    }
  }

  async findOne(id: string): Promise<OfficeResponseDto> {
    const office = await this.officeRepository.findOne({
      where: { id },
      relations: ["company"],
    });
    if (!office) {
      throw new NotFoundException("Oficina no encontrada");
    }
    return OfficeMapper.toResponseDto(office);
  }

  async create(createOfficeDto: CreateOfficeDto): Promise<OfficeResponseDto> {
    try {
      const savedOffice = await this.officeRepository.save({
        id: uuidv4(),
        companyId: createOfficeDto.company_id,
        officeName: createOfficeDto.office_name,
        officeStatus: createOfficeDto.office_status,
        updatedAt: new Date(Date.now()),
      });

      // Obtener la oficina con la relación de compañía para devolver el nombre
      return await this.findOne(savedOffice.id);
    } catch (error) {
      throw new InternalServerErrorException("Error al crear la oficina");
    }
  }

  async update(updateOfficeDto: UpdateOfficeDto): Promise<OfficeResponseDto> {
    const { id, ...updateData } = updateOfficeDto;
    await this.findOne(id);

    try {
      await this.officeRepository.update(
        { id },
        {
          companyId: updateData.company_id,
          officeName: updateData.office_name,
          officeStatus: updateData.office_status,
        }
      );
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException("Error al actualizar la oficina");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    try {
      await this.officeRepository.delete({ id });
      return { message: "Oficina eliminada correctamente" };
    } catch (error) {
      throw new InternalServerErrorException("Error al eliminar la oficina");
    }
  }
}
