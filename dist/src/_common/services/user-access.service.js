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
exports.UserAccessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_access_repository_1 = require("../repository/user-access.repository");
let UserAccessService = class UserAccessService {
    constructor(userAccessRepository) {
        this.userAccessRepository = userAccessRepository;
    }
    async getAccessibleCompanies(userId) {
        return await this.userAccessRepository.getAccessibleCompanies(userId);
    }
    async getAccessibleOffices(userId) {
        return await this.userAccessRepository.getAccessibleOffices(userId);
    }
    async hasAccessToCompany(userId, companyId) {
        return await this.userAccessRepository.hasAccessToCompany(userId, companyId);
    }
    async hasAccessToOffice(userId, officeId) {
        return await this.userAccessRepository.hasAccessToOffice(userId, officeId);
    }
    async buildOfficeFilter(token) {
        const accessibleOffices = await this.getAccessibleOffices(token.id);
        console.log("Offices accessible for user:", accessibleOffices);
        if (accessibleOffices.length === 0) {
            throw new Error("El usuario no tiene acceso a ninguna oficina");
        }
        if (accessibleOffices.length === 1) {
            return { id: accessibleOffices[0] };
        }
        return { id: (0, typeorm_1.In)(accessibleOffices) };
    }
    async buildCompanyFilter(token) {
        const accessibleCompanies = await this.getAccessibleCompanies(token.id);
        if (accessibleCompanies.length === 0) {
            throw new Error("El usuario no tiene acceso a ninguna compañía");
        }
        if (accessibleCompanies.length === 1) {
            return { id: accessibleCompanies[0] };
        }
        return { id: (0, typeorm_1.In)(accessibleCompanies) };
    }
    async validateAccess(token, companyId, officeId) {
        if (companyId && !(await this.hasAccessToCompany(token.id, companyId))) {
            return false;
        }
        if (officeId && !(await this.hasAccessToOffice(token.id, officeId))) {
            return false;
        }
        return true;
    }
};
UserAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_access_repository_1.UserAccessRepository])
], UserAccessService);
exports.UserAccessService = UserAccessService;
//# sourceMappingURL=user-access.service.js.map