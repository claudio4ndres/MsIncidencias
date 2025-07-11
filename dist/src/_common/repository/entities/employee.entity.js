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
exports.EmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const office_entity_1 = require("./office.entity");
const movement_entity_1 = require("./movement.entity");
let EmployeeEntity = class EmployeeEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'office_id',
        type: 'varchar',
        length: 191,
        nullable: false
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "officeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'employee_code',
        type: 'int',
        nullable: false,
        unique: true,
        comment: 'Código único del empleado'
    }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "employeeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'employee_name',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Nombre del empleado'
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'employee_type',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Tipo de empleado'
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "employeeType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'employee_status',
        type: 'int',
        nullable: false,
        comment: 'Estado del empleado (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "employeeStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => office_entity_1.OfficeEntity, office => office.employees, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'office_id' }),
    __metadata("design:type", office_entity_1.OfficeEntity)
], EmployeeEntity.prototype, "office", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movement_entity_1.MovementEntity, movement => movement.employee),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "movements", void 0);
EmployeeEntity = __decorate([
    (0, typeorm_1.Entity)('employees'),
    (0, typeorm_1.Index)('idx_employee_office_id', ['officeId']),
    (0, typeorm_1.Index)('idx_employee_code', ['employeeCode']),
    (0, typeorm_1.Index)('idx_employee_status', ['employeeStatus']),
    (0, typeorm_1.Index)('idx_employee_type', ['employeeType'])
], EmployeeEntity);
exports.EmployeeEntity = EmployeeEntity;
//# sourceMappingURL=employee.entity.js.map