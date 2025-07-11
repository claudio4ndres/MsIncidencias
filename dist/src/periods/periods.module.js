"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodsModule = void 0;
const common_1 = require("@nestjs/common");
const periods_controller_1 = require("./periods.controller");
const periods_service_1 = require("./periods.service");
const calendar_repository_1 = require("../_common/repository/calendar.repository");
const movement_repository_1 = require("../_common/repository/movement.repository");
const typeorm_1 = require("@nestjs/typeorm");
const calendar_entity_1 = require("../_common/repository/entities/calendar.entity");
const movement_entity_1 = require("../_common/repository/entities/movement.entity");
let PeriodsModule = class PeriodsModule {
};
PeriodsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([calendar_entity_1.Calendar, movement_entity_1.MovementEntity])],
        controllers: [periods_controller_1.PeriodsController],
        providers: [periods_service_1.PeriodsService, calendar_repository_1.CalendarRepository, movement_repository_1.MovementRepository],
        exports: [periods_service_1.PeriodsService],
    })
], PeriodsModule);
exports.PeriodsModule = PeriodsModule;
//# sourceMappingURL=periods.module.js.map