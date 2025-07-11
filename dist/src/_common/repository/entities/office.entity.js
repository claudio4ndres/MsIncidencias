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
exports.OfficeEntity = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("./company.entity");
const employee_entity_1 = require("./employee.entity");
const user_access_entity_1 = require("./user-access.entity");
let OfficeEntity = class OfficeEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], OfficeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_id',
        type: 'varchar',
        length: 191,
        nullable: false
    }),
    __metadata("design:type", String)
], OfficeEntity.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'office_name',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Nombre de la oficina'
    }),
    __metadata("design:type", String)
], OfficeEntity.prototype, "officeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'office_status',
        type: 'int',
        nullable: false,
        comment: 'Estado de la oficina (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], OfficeEntity.prototype, "officeStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], OfficeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], OfficeEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.CompanyEntity, company => company.offices, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", company_entity_1.CompanyEntity)
], OfficeEntity.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_entity_1.EmployeeEntity, employee => employee.office),
    __metadata("design:type", Array)
], OfficeEntity.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_access_entity_1.UserAccessEntity, userAccess => userAccess.office),
    __metadata("design:type", Array)
], OfficeEntity.prototype, "userAccess", void 0);
OfficeEntity = __decorate([
    (0, typeorm_1.Entity)('offices'),
    (0, typeorm_1.Index)('idx_office_company_id', ['companyId']),
    (0, typeorm_1.Index)('idx_office_status', ['officeStatus']),
    (0, typeorm_1.Index)('idx_office_name', ['officeName'])
], OfficeEntity);
exports.OfficeEntity = OfficeEntity;
//# sourceMappingURL=office.entity.js.map