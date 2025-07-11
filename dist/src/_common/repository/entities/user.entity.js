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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const user_access_entity_1 = require("./user-access.entity");
let UserEntity = class UserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_name',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Nombre del usuario'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_email',
        type: 'varchar',
        length: 191,
        nullable: false,
        unique: true,
        comment: 'Email único del usuario'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_password',
        type: 'varchar',
        length: 191,
        nullable: false,
        comment: 'Contraseña encriptada del usuario'
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_status',
        type: 'int',
        nullable: false,
        comment: 'Estado del usuario (1 = activo, 0 = inactivo)'
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "userStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_rol',
        type: 'int',
        nullable: false,
        comment: 'Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)'
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "userRol", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        comment: 'Fecha y hora de creación del registro'
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
        precision: 6,
        comment: 'Fecha y hora de última actualización del registro'
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_access_entity_1.UserAccessEntity, userAccess => userAccess.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "userAccess", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)('idx_user_email', ['userEmail']),
    (0, typeorm_1.Index)('idx_user_status', ['userStatus']),
    (0, typeorm_1.Index)('idx_user_rol', ['userRol'])
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map