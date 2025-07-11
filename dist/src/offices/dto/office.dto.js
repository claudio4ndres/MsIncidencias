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
exports.DeleteOfficeDto = exports.OfficeResponseDto = exports.UpdateOfficeDto = exports.CreateOfficeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateOfficeDto {
    constructor() {
        this.office_status = 1;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la compañía', example: 'comp-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOfficeDto.prototype, "company_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la oficina', example: 'Oficina Centro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOfficeDto.prototype, "office_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de la oficina', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOfficeDto.prototype, "office_status", void 0);
exports.CreateOfficeDto = CreateOfficeDto;
class UpdateOfficeDto extends (0, swagger_1.PartialType)(CreateOfficeDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la oficina', example: 'office-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateOfficeDto.prototype, "id", void 0);
exports.UpdateOfficeDto = UpdateOfficeDto;
class OfficeResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OfficeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OfficeResponseDto.prototype, "company_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OfficeResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OfficeResponseDto.prototype, "office_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OfficeResponseDto.prototype, "office_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OfficeResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OfficeResponseDto.prototype, "updated_at", void 0);
exports.OfficeResponseDto = OfficeResponseDto;
class DeleteOfficeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteOfficeDto.prototype, "id", void 0);
exports.DeleteOfficeDto = DeleteOfficeDto;
//# sourceMappingURL=office.dto.js.map