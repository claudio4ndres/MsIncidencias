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
exports.CompanyEntity = void 0;
const typeorm_1 = require("typeorm");
const office_entity_1 = require("./office.entity");
const user_access_entity_1 = require("./user-access.entity");
let CompanyEntity = class CompanyEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_name',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Nombre de la compañía'
    }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_status',
        type: 'int',
        nullable: false,
        comment: 'Estado de la compañía (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], CompanyEntity.prototype, "companyStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => office_entity_1.OfficeEntity, office => office.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "offices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_access_entity_1.UserAccessEntity, userAccess => userAccess.company),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "userAccess", void 0);
CompanyEntity = __decorate([
    (0, typeorm_1.Entity)('companies'),
    (0, typeorm_1.Index)('idx_company_status', ['companyStatus']),
    (0, typeorm_1.Index)('idx_company_name', ['companyName'])
], CompanyEntity);
exports.CompanyEntity = CompanyEntity;
//# sourceMappingURL=company.entity.js.map