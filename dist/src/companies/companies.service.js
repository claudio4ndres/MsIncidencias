"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
const company_mapper_1 = require("./mappers/company.mapper");
let CompaniesService = class CompaniesService {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const whereCondition = search ? { companyName: (0, typeorm_1.Like)(`%${search}%`) } : {};
            const [companies, total] = await Promise.all([
                this.companyRepository.find({
                    where: whereCondition,
                    skip,
                    take: pageSize,
                    order: { createdAt: "DESC" },
                }),
                this.companyRepository.count({ where: whereCondition }),
            ]);
            const companiesDto = company_mapper_1.CompanyMapper.toResponseDtoArray(companies);
            return new pagination_dto_1.PaginatedResponseDto(companiesDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener las compañías");
        }
    }
    async findOne(id) {
        const company = await this.companyRepository.findOne({
            where: { id },
        });
        if (!company) {
            throw new common_1.NotFoundException("Compañía no encontrada");
        }
        return company_mapper_1.CompanyMapper.toResponseDto(company);
    }
    async create(createCompanyDto) {
        try {
            const savedCompany = await this.companyRepository.save({
                id: (0, uuid_1.v4)(),
                companyName: createCompanyDto.company_name,
                companyStatus: createCompanyDto.company_status,
                updatedAt: new Date(),
            });
            return company_mapper_1.CompanyMapper.toResponseDto(savedCompany);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al crear la compañía");
        }
    }
    async update(updateCompanyDto) {
        const { id, company_name, company_status } = updateCompanyDto;
        await this.findOne(id);
        try {
            await this.companyRepository.update({ id }, {
                companyName: company_name,
                companyStatus: company_status,
            });
            return await this.findOne(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al actualizar la compañía");
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            await this.companyRepository.delete({ id });
            return { message: "Compañía eliminada correctamente" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al eliminar la compañía");
        }
    }
    async findByStatus(status) {
        try {
            const companies = await this.companyRepository.find({
                where: { companyStatus: status },
            });
            return company_mapper_1.CompanyMapper.toResponseDtoArray(companies);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener compañías por estado");
        }
    }
    async findWithOffices(id) {
        try {
            const company = await this.companyRepository.findOne({
                where: { id },
                relations: ["offices"],
            });
            if (!company) {
                throw new common_1.NotFoundException("Compañía no encontrada");
            }
            return company_mapper_1.CompanyMapper.toResponseDto(company);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al obtener la compañía con oficinas");
        }
    }
    async findWithUsers(id) {
        try {
            const company = await this.companyRepository.findOne({
                where: { id },
                relations: ["users"],
            });
            if (!company) {
                throw new common_1.NotFoundException("Compañía no encontrada");
            }
            return company_mapper_1.CompanyMapper.toResponseDto(company);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error al obtener la compañía con usuarios");
        }
    }
};
CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.CompanyRepository])
], CompaniesService);
exports.CompaniesService = CompaniesService;
//# sourceMappingURL=companies.service.js.map