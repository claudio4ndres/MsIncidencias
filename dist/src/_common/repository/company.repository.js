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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./entities/company.entity");
let CompanyRepository = class CompanyRepository {
    constructor(companyEntity) {
        this.companyEntity = companyEntity;
    }
    async findOne(criteria) {
        return this.companyEntity.findOne(criteria);
    }
    async create(payload) {
        return this.companyEntity.create(payload);
    }
    async save(payload) {
        return this.companyEntity.save(payload);
    }
    async update(criteria, payload) {
        return this.companyEntity.update(criteria, payload);
    }
    async find(payload) {
        return this.companyEntity.find(payload);
    }
    async delete(payload) {
        return this.companyEntity.delete(payload);
    }
    async count(options) {
        return this.companyEntity.count(options);
    }
    async findByStatus(status) {
        return this.companyEntity.find({
            where: { companyStatus: status }
        });
    }
    async findByName(name) {
        return this.companyEntity.findOne({
            where: { companyName: name }
        });
    }
    async findWithOffices(id) {
        return this.companyEntity.findOne({
            where: { id },
            relations: ['offices']
        });
    }
    async findWithUsers(id) {
        return this.companyEntity.findOne({
            where: { id },
            relations: ['users']
        });
    }
};
CompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.CompanyEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompanyRepository);
exports.CompanyRepository = CompanyRepository;
//# sourceMappingURL=company.repository.js.map