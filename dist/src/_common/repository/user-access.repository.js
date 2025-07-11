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
exports.UserAccessRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_access_entity_1 = require("./entities/user-access.entity");
let UserAccessRepository = class UserAccessRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findByUserId(userId) {
        return await this.repository.find({
            where: { userId, status: 1 },
            relations: ["company", "office"],
        });
    }
    async findByUserIdAndCompany(userId, companyId) {
        return await this.repository.find({
            where: { userId, companyId, status: 1 },
            relations: ["company", "office"],
        });
    }
    async findByUserIdAndOffice(userId, officeId) {
        return await this.repository.findOne({
            where: { userId, officeId, status: 1 },
            relations: ["company", "office"],
        });
    }
    async hasAccessToCompany(userId, companyId) {
        const count = await this.repository.count({
            where: { userId, companyId, status: 1 },
        });
        return count > 0;
    }
    async hasAccessToOffice(userId, officeId) {
        const count = await this.repository.count({
            where: { userId, officeId, status: 1 },
        });
        return count > 0;
    }
    async getAccessibleCompanies(userId) {
        const accesses = await this.repository.find({
            where: { userId, status: 1 },
            select: ["companyId"],
        });
        console.log("Accessible companies for user:", accesses);
        return [...new Set(accesses.map((access) => access.companyId))];
    }
    async getAccessibleOffices(userId) {
        const accesses = await this.repository.find({
            where: { userId, status: 1 },
            select: ['officeId']
        });
        return [...new Set(accesses.map(access => access.officeId))];
    }
    async save(userAccess) {
        return await this.repository.save(userAccess);
    }
};
UserAccessRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_access_entity_1.UserAccessEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserAccessRepository);
exports.UserAccessRepository = UserAccessRepository;
//# sourceMappingURL=user-access.repository.js.map