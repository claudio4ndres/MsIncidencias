"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_guard_1 = require("../_common/guards/jwt-auth.guard");
const repository_1 = require("../_common/repository");
const user_access_service_1 = require("../_common/services/user-access.service");
const movements_controller_1 = require("./movements.controller");
const movements_service_1 = require("./movements.service");
let MovementsModule = class MovementsModule {
};
MovementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                repository_1.MovementEntity,
                repository_1.EmployeeEntity,
                repository_1.IncidentEntity,
                repository_1.UserAccessEntity,
            ]),
            jwt_1.JwtModule.register({}),
        ],
        controllers: [movements_controller_1.MovementsController],
        providers: [
            movements_service_1.MovementsService,
            repository_1.MovementRepository,
            repository_1.EmployeeRepository,
            repository_1.IncidentRepository,
            repository_1.UserAccessRepository,
            user_access_service_1.UserAccessService,
            jwt_auth_guard_1.JwtAuthGuard,
        ],
        exports: [movements_service_1.MovementsService],
    })
], MovementsModule);
exports.MovementsModule = MovementsModule;
//# sourceMappingURL=movements.module.js.map