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
exports.MovementEntity = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const incident_entity_1 = require("./incident.entity");
let MovementEntity = class MovementEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], MovementEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'employee_code',
        type: 'int',
        nullable: false
    }),
    __metadata("design:type", Number)
], MovementEntity.prototype, "employeeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incident_code',
        type: 'varchar',
        length: 191,
        nullable: false
    }),
    __metadata("design:type", String)
], MovementEntity.prototype, "incidentCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incidence_date',
        type: 'datetime',
        precision: 3,
        nullable: false,
        comment: 'Fecha de la incidencia'
    }),
    __metadata("design:type", Date)
], MovementEntity.prototype, "incidenceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incidence_observation',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Observaciones de la incidencia'
    }),
    __metadata("design:type", String)
], MovementEntity.prototype, "incidenceObservation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incidence_status',
        type: 'int',
        nullable: false,
        comment: 'Estado de la incidencia (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], MovementEntity.prototype, "incidenceStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], MovementEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], MovementEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.EmployeeEntity, employee => employee.movements, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_code', referencedColumnName: 'employeeCode' }),
    __metadata("design:type", employee_entity_1.EmployeeEntity)
], MovementEntity.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => incident_entity_1.IncidentEntity, incident => incident.movements, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incident_code', referencedColumnName: 'incidentCode' }),
    __metadata("design:type", incident_entity_1.IncidentEntity)
], MovementEntity.prototype, "incident", void 0);
MovementEntity = __decorate([
    (0, typeorm_1.Entity)('movements'),
    (0, typeorm_1.Index)('idx_movement_employee_code', ['employeeCode']),
    (0, typeorm_1.Index)('idx_movement_incident_code', ['incidentCode']),
    (0, typeorm_1.Index)('idx_movement_status', ['incidenceStatus']),
    (0, typeorm_1.Index)('idx_movement_date', ['incidenceDate'])
], MovementEntity);
exports.MovementEntity = MovementEntity;
//# sourceMappingURL=movement.entity.js.map