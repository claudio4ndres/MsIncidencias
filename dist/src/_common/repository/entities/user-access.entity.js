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
exports.UserAccessEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const company_entity_1 = require("./company.entity");
const office_entity_1 = require("./office.entity");
let UserAccessEntity = class UserAccessEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAccessEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_id',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'ID del usuario'
    }),
    __metadata("design:type", String)
], UserAccessEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_id',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'ID de la compañía'
    }),
    __metadata("design:type", String)
], UserAccessEntity.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'office_id',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'ID de la oficina'
    }),
    __metadata("design:type", String)
], UserAccessEntity.prototype, "officeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'int',
        nullable: false,
        default: 1,
        comment: 'Estado del acceso (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], UserAccessEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], UserAccessEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], UserAccessEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.userAccess, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], UserAccessEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.CompanyEntity, company => company.userAccess, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", company_entity_1.CompanyEntity)
], UserAccessEntity.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => office_entity_1.OfficeEntity, office => office.userAccess, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'office_id' }),
    __metadata("design:type", office_entity_1.OfficeEntity)
], UserAccessEntity.prototype, "office", void 0);
UserAccessEntity = __decorate([
    (0, typeorm_1.Entity)('user_access'),
    (0, typeorm_1.Index)('idx_user_access_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_user_access_company_id', ['companyId']),
    (0, typeorm_1.Index)('idx_user_access_office_id', ['officeId']),
    (0, typeorm_1.Index)('idx_user_access_status', ['status']),
    (0, typeorm_1.Index)('idx_user_access_composite', ['userId', 'companyId', 'officeId'])
], UserAccessEntity);
exports.UserAccessEntity = UserAccessEntity;
//# sourceMappingURL=user-access.entity.js.map