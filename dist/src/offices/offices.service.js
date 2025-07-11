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
exports.OfficesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const pagination_dto_1 = require("../_common/dto/pagination.dto");
const repository_1 = require("../_common/repository");
const office_mapper_1 = require("./mappers/office.mapper");
let OfficesService = class OfficesService {
    constructor(officeRepository) {
        this.officeRepository = officeRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, pageSize = 10, search = "" } = paginationQuery;
        const skip = (page - 1) * pageSize;
        try {
            const whereCondition = search ? { officeName: (0, typeorm_1.Like)(`%${search}%`) } : {};
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
            const officesDto = office_mapper_1.OfficeMapper.toResponseDtoArray(offices);
            return new pagination_dto_1.PaginatedResponseDto(officesDto, total, page, pageSize);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al obtener las oficinas");
        }
    }
    async findOne(id) {
        const office = await this.officeRepository.findOne({
            where: { id },
            relations: ["company"],
        });
        if (!office) {
            throw new common_1.NotFoundException("Oficina no encontrada");
        }
        return office_mapper_1.OfficeMapper.toResponseDto(office);
    }
    async create(createOfficeDto) {
        try {
            const savedOffice = await this.officeRepository.save({
                companyId: createOfficeDto.company_id,
                officeName: createOfficeDto.office_name,
                officeStatus: createOfficeDto.office_status,
            });
            return await this.findOne(savedOffice.id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al crear la oficina");
        }
    }
    async update(updateOfficeDto) {
        const { id, ...updateData } = updateOfficeDto;
        await this.findOne(id);
        try {
            await this.officeRepository.update({ id }, {
                companyId: updateData.company_id,
                officeName: updateData.office_name,
                officeStatus: updateData.office_status,
            });
            return await this.findOne(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al actualizar la oficina");
        }
    }
    async remove(id) {
        await this.findOne(id);
        try {
            await this.officeRepository.delete({ id });
            return { message: "Oficina eliminada correctamente" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error al eliminar la oficina");
        }
    }
};
OfficesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.OfficeRepository])
], OfficesService);
exports.OfficesService = OfficesService;
//# sourceMappingURL=offices.service.js.map