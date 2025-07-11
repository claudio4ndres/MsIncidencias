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
exports.BulkCreateCalendarDto = exports.CalendarResponseDto = exports.UpdateCalendarDto = exports.CreateCalendarDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCalendarDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Month identifier (e.g., "1A. ENE", "2A. FEB")',
        example: '1A. ENE'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period identifier',
        example: '2025001'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date range description',
        example: 'jueves 26 diciembre al jueves 2 enero'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "range", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident submission date',
        example: '2025-01-02T00:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "incidentSubmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Process date',
        example: '2025-01-03T00:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy generation date',
        example: '2025-01-03T00:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "policyGeneration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date',
        example: '2025-01-10T00:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCalendarDto.prototype, "payment", void 0);
exports.CreateCalendarDto = CreateCalendarDto;
class UpdateCalendarDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Month identifier (e.g., "1A. ENE", "2A. FEB")',
        example: '1A. ENE',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period identifier',
        example: '2025001',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date range description',
        example: 'jueves 26 diciembre al jueves 2 enero',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "range", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Incident submission date',
        example: '2025-01-02T00:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "incidentSubmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Process date',
        example: '2025-01-03T00:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy generation date',
        example: '2025-01-03T00:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "policyGeneration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date',
        example: '2025-01-10T00:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCalendarDto.prototype, "payment", void 0);
exports.UpdateCalendarDto = UpdateCalendarDto;
class CalendarResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calendar ID' }),
    __metadata("design:type", Number)
], CalendarResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Month identifier' }),
    __metadata("design:type", String)
], CalendarResponseDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period identifier' }),
    __metadata("design:type", String)
], CalendarResponseDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date range description' }),
    __metadata("design:type", String)
], CalendarResponseDto.prototype, "range", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident submission date' }),
    __metadata("design:type", Date)
], CalendarResponseDto.prototype, "incidentSubmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Process date' }),
    __metadata("design:type", Date)
], CalendarResponseDto.prototype, "process", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy generation date' }),
    __metadata("design:type", Date)
], CalendarResponseDto.prototype, "policyGeneration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date' }),
    __metadata("design:type", Date)
], CalendarResponseDto.prototype, "payment", void 0);
exports.CalendarResponseDto = CalendarResponseDto;
class BulkCreateCalendarDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of calendar entries to create',
        type: [CreateCalendarDto]
    }),
    __metadata("design:type", Array)
], BulkCreateCalendarDto.prototype, "calendars", void 0);
exports.BulkCreateCalendarDto = BulkCreateCalendarDto;
//# sourceMappingURL=calendar.dto.js.map