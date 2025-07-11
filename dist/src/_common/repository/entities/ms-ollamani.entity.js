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
exports.MsOllamaniEntity = void 0;
const typeorm_1 = require("typeorm");
let MsOllamaniEntity = class MsOllamaniEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MsOllamaniEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: false,
        comment: 'Nombre del elemento ollamani (máximo 100 caracteres)'
    }),
    __metadata("design:type", String)
], MsOllamaniEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        nullable: false,
        comment: 'Descripción del elemento ollamani (máximo 500 caracteres)'
    }),
    __metadata("design:type", String)
], MsOllamaniEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
        comment: 'Estado del registro (true = activo, false = inactivo)'
    }),
    __metadata("design:type", Boolean)
], MsOllamaniEntity.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'fecha_creacion',
        type: 'timestamp',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], MsOllamaniEntity.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'fecha_actualizacion',
        type: 'timestamp',
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], MsOllamaniEntity.prototype, "fechaActualizacion", void 0);
MsOllamaniEntity = __decorate([
    (0, typeorm_1.Entity)('ms_ollamani'),
    (0, typeorm_1.Index)('idx_ms_ollamani_activo', ['activo']),
    (0, typeorm_1.Index)('idx_ms_ollamani_nombre', ['nombre']),
    (0, typeorm_1.Index)('idx_ms_ollamani_fecha_creacion', ['fechaCreacion'])
], MsOllamaniEntity);
exports.MsOllamaniEntity = MsOllamaniEntity;
//# sourceMappingURL=ms-ollamani.entity.js.map