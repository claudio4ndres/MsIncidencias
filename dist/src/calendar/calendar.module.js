"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_guard_1 = require("../_common/guards/jwt-auth.guard");
const repository_1 = require("../_common/repository");
const calendar_entity_1 = require("../_common/repository/entities/calendar.entity");
const calendar_controller_1 = require("./calendar.controller");
const calendar_service_1 = require("./calendar.service");
let CalendarModule = class CalendarModule {
};
CalendarModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([repository_1.CompanyEntity, calendar_entity_1.Calendar]),
            jwt_1.JwtModule.register({}),
        ],
        controllers: [calendar_controller_1.CalendarController],
        providers: [calendar_service_1.CalendarService, repository_1.CalendarRepository, repository_1.CompanyRepository, jwt_auth_guard_1.JwtAuthGuard],
        exports: [calendar_service_1.CalendarService],
    })
], CalendarModule);
exports.CalendarModule = CalendarModule;
//# sourceMappingURL=calendar.module.js.map