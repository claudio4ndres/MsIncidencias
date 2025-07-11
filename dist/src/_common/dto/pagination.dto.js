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
exports.PaginatedResponseDto = exports.PaginationQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PaginationQueryDto {
    constructor() {
        this.page = 1;
        this.pageSize = 10;
        this.search = '';
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de página',
        example: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'La página debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'La página debe ser mayor a 0' }),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de elementos por página',
        example: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'El tamaño de página debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'El tamaño de página debe ser mayor a 0' }),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Término de búsqueda',
        example: 'texto a buscar'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El término de búsqueda debe ser una cadena de texto' }),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "search", void 0);
exports.PaginationQueryDto = PaginationQueryDto;
class PaginatedResponseDto {
    constructor(data, total, page, pageSize) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = Math.ceil(total / pageSize);
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lista de elementos',
        isArray: true
    }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total de elementos',
        example: 100
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Página actual',
        example: 1
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Elementos por página',
        example: 10
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total de páginas',
        example: 10
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPages", void 0);
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=pagination.dto.js.map