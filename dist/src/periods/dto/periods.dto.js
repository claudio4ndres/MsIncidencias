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
exports.PeriodResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PeriodResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calendar ID',
        example: 1
    }),
    __metadata("design:type", Number)
], PeriodResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Month identifier',
        example: '1A. ENE'
    }),
    __metadata("design:type", String)
], PeriodResponseDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period identifier',
        example: '2025001'
    }),
    __metadata("design:type", String)
], PeriodResponseDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date range description',
        example: 'jueves 26 diciembre al jueves 2 enero'
    }),
    __metadata("design:type", String)
], PeriodResponseDto.prototype, "range", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident submission date',
        example: '2025-01-02T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], PeriodResponseDto.prototype, "incidentSubmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Process date',
        example: '2025-01-03T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], PeriodResponseDto.prototype, "process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy generation date',
        example: '2025-01-03T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], PeriodResponseDto.prototype, "policyGeneration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date',
        example: '2025-01-10T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], PeriodResponseDto.prototype, "payment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ISO week number',
        example: 52
    }),
    __metadata("design:type", Number)
], PeriodResponseDto.prototype, "semana", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total weeks in the year',
        example: 52
    }),
    __metadata("design:type", Number)
], PeriodResponseDto.prototype, "semanasEnAnio", void 0);
exports.PeriodResponseDto = PeriodResponseDto;
//# sourceMappingURL=periods.dto.js.map