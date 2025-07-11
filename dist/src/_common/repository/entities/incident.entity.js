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
exports.IncidentEntity = void 0;
const typeorm_1 = require("typeorm");
const movement_entity_1 = require("./movement.entity");
let IncidentEntity = class IncidentEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], IncidentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incident_code',
        type: 'varchar',
        length: 191,
        nullable: false,
        unique: true,
        comment: 'Código único del incidente'
    }),
    __metadata("design:type", String)
], IncidentEntity.prototype, "incidentCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incident_name',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Nombre del incidente'
    }),
    __metadata("design:type", String)
], IncidentEntity.prototype, "incidentName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'incident_status',
        type: 'int',
        nullable: false,
        comment: 'Estado del incidente (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], IncidentEntity.prototype, "incidentStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], IncidentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], IncidentEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movement_entity_1.MovementEntity, movement => movement.incident),
    __metadata("design:type", Array)
], IncidentEntity.prototype, "movements", void 0);
IncidentEntity = __decorate([
    (0, typeorm_1.Entity)('incidents'),
    (0, typeorm_1.Index)('idx_incident_code', ['incidentCode']),
    (0, typeorm_1.Index)('idx_incident_status', ['incidentStatus']),
    (0, typeorm_1.Index)('idx_incident_name', ['incidentName'])
], IncidentEntity);
exports.IncidentEntity = IncidentEntity;
//# sourceMappingURL=incident.entity.js.map