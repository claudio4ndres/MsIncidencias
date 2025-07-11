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
import { CompanyRepository } from "../_common/repository";
import {
  CompanyResponseDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from "./dto/company.dto";
import { CompanyMapper } from "./mappers/company.mapper";

@Injectable()
export class CompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<CompanyResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition = search ? { companyName: Like(`%${search}%`) } : {};

      const [companies, total] = await Promise.all([
        this.companyRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { createdAt: "DESC" },
        }),
        this.companyRepository.count({ where: whereCondition }),
      ]);

      const companiesDto = CompanyMapper.toResponseDtoArray(companies);
      return new PaginatedResponseDto(companiesDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener las compañías");
    }
  }

  async findOne(id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException("Compañía no encontrada");
    }

    return CompanyMapper.toResponseDto(company);
  }

  async create(
    createCompanyDto: CreateCompanyDto
  ): Promise<CompanyResponseDto> {
    try {
      const savedCompany = await this.companyRepository.save({
        id: uuidv4(),
        companyName: createCompanyDto.company_name,
        companyStatus: createCompanyDto.company_status,
        updatedAt: new Date(),
      });
      return CompanyMapper.toResponseDto(savedCompany);
    } catch (error) {
      throw new InternalServerErrorException("Error al crear la compañía");
    }
  }

  async update(
    updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyResponseDto> {
    const { id, company_name, company_status } = updateCompanyDto;

    // Verificar que la compañía existe
    await this.findOne(id);

    try {
      await this.companyRepository.update(
        { id },
        {
          companyName: company_name,
          companyStatus: company_status,
        }
      );

      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException("Error al actualizar la compañía");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verificar que la compañía existe
    await this.findOne(id);

    try {
      await this.companyRepository.delete({ id });
      return { message: "Compañía eliminada correctamente" };
    } catch (error) {
      throw new InternalServerErrorException("Error al eliminar la compañía");
    }
  }

  async findByStatus(status: number): Promise<CompanyResponseDto[]> {
    try {
      const companies = await this.companyRepository.find({
        where: { companyStatus: status },
      });
      return CompanyMapper.toResponseDtoArray(companies);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener compañías por estado"
      );
    }
  }

  async findWithOffices(id: string): Promise<CompanyResponseDto> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ["offices"],
      });
      if (!company) {
        throw new NotFoundException("Compañía no encontrada");
      }
      return CompanyMapper.toResponseDto(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al obtener la compañía con oficinas"
      );
    }
  }

  async findWithUsers(id: string): Promise<CompanyResponseDto> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ["users"],
      });
      if (!company) {
        throw new NotFoundException("Compañía no encontrada");
      }
      return CompanyMapper.toResponseDto(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al obtener la compañía con usuarios"
      );
    }
  }
}
