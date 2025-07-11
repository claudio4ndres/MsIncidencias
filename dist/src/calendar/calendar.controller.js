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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const calendar_service_1 = require("./calendar.service");
const calendar_dto_1 = require("./dto/calendar.dto");
const XLSX = require("xlsx");
let CalendarController = class CalendarController {
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    async findAll() {
        return this.calendarService.findAll();
    }
    async findByPeriod(period) {
        return this.calendarService.findByPeriod(period);
    }
    async findByMonth(month) {
        return this.calendarService.findByMonth(month);
    }
    async findByDateRange(startDate, endDate) {
        return this.calendarService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    async findOne(id) {
        return this.calendarService.findOne(id);
    }
    async create(createCalendarDto) {
        return this.calendarService.create(createCalendarDto);
    }
    async bulkCreate(bulkCreateDto) {
        return this.calendarService.bulkCreate(bulkCreateDto);
    }
    async importFromExcel(file) {
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
            throw new common_1.BadRequestException("Only Excel files are allowed");
        }
        try {
            const workbook = XLSX.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let headerRowIndex = -1;
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                if (row && row.includes("MES") && row.includes("PERIODO")) {
                    headerRowIndex = i;
                    break;
                }
            }
            if (headerRowIndex === -1) {
                throw new common_1.BadRequestException("No se encontraron los headers esperados en el archivo Excel");
            }
            const headers = rawData[headerRowIndex];
            const dataRows = rawData
                .slice(headerRowIndex + 1)
                .filter((row) => row.length > 0);
            const excelData = dataRows
                .map((row) => {
                const obj = {};
                headers.forEach((header, i) => {
                    if (header && row[i] !== undefined) {
                        obj[header] = row[i];
                    }
                });
                return obj;
            })
                .filter((obj) => obj.MES && obj.PERIODO);
            return this.calendarService.importFromExcel(excelData);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error processing Excel file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async update(id, updateCalendarDto) {
        return this.calendarService.update(id, updateCalendarDto);
    }
    async delete(id) {
        await this.calendarService.delete(id);
        return { message: "Calendar deleted successfully" };
    }
    async validateRule(file) {
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
            throw new common_1.BadRequestException("Only Excel files are allowed");
        }
        try {
            const workbook = XLSX.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let headerRowIndex = -1;
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                if (row && row.length > 0) {
                    const hasNumEmp = row.some((cell) => cell && typeof cell === "string" && cell.includes("NUM. EMP"));
                    const hasNombreEmpleado = row.some((cell) => cell &&
                        typeof cell === "string" &&
                        cell.includes("NOMBRE DEL EMPLEADO"));
                    const hasTipoEmpl = row.some((cell) => cell && typeof cell === "string" && cell.includes("TIPO EMPL"));
                    if (hasNumEmp && hasNombreEmpleado && hasTipoEmpl) {
                        headerRowIndex = i;
                        break;
                    }
                }
            }
            if (headerRowIndex === -1) {
                throw new common_1.BadRequestException("No se encontraron los headers esperados en el archivo Excel");
            }
            const headers = rawData[headerRowIndex];
            const dataRows = rawData
                .slice(headerRowIndex + 1)
                .filter((row) => row &&
                row.length > 0 &&
                row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
            const excelData = dataRows
                .map((row) => {
                const obj = {};
                headers.forEach((header, i) => {
                    if (header && row[i] !== undefined && row[i] !== null) {
                        obj[header] = row[i];
                    }
                });
                return obj;
            })
                .filter((obj) => Object.keys(obj).length > 0);
            const jsonData = await this.calendarService.validateRules(excelData);
            return {
                success: true,
                message: "Archivo Excel procesado y convertido a JSON exitosamente",
                data: jsonData,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error processing Excel file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtener todos los calendarios de nómina" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendarios obtenidos exitosamente",
        type: [calendar_dto_1.CalendarResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("search/period/:period"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar calendario por periodo" }),
    (0, swagger_1.ApiParam)({
        name: "period",
        description: "Periodo a buscar",
        example: "2025001",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendario encontrado",
        type: calendar_dto_1.CalendarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Calendario no encontrado" }),
    __param(0, (0, common_1.Param)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findByPeriod", null);
__decorate([
    (0, common_1.Get)("search/month/:month"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar calendarios por mes" }),
    (0, swagger_1.ApiParam)({ name: "month", description: "Mes a buscar", example: "1A. ENE" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendarios encontrados",
        type: [calendar_dto_1.CalendarResponseDto],
    }),
    __param(0, (0, common_1.Param)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findByMonth", null);
__decorate([
    (0, common_1.Get)("search/date-range"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar calendarios por rango de fechas" }),
    (0, swagger_1.ApiQuery)({
        name: "startDate",
        description: "Fecha de inicio",
        example: "2025-01-01",
    }),
    (0, swagger_1.ApiQuery)({
        name: "endDate",
        description: "Fecha de fin",
        example: "2025-12-31",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendarios encontrados",
        type: [calendar_dto_1.CalendarResponseDto],
    }),
    __param(0, (0, common_1.Query)("startDate")),
    __param(1, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Obtener calendario por ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID del calendario", type: "number" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendario encontrado",
        type: calendar_dto_1.CalendarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Calendario no encontrado" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Crear nuevo calendario" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Calendario creado exitosamente",
        type: calendar_dto_1.CalendarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calendar_dto_1.CreateCalendarDto]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, swagger_1.ApiOperation)({ summary: "Crear múltiples calendarios" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Calendarios creados exitosamente",
        type: [calendar_dto_1.CalendarResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calendar_dto_1.BulkCreateCalendarDto]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)("import/excel"),
    (0, swagger_1.ApiOperation)({ summary: "Importar calendarios desde archivo Excel" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        description: "Archivo Excel con datos de calendario",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Calendarios importados exitosamente",
        type: [calendar_dto_1.CalendarResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Error en el archivo Excel" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "importFromExcel", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Actualizar calendario" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID del calendario", type: "number" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendario actualizado exitosamente",
        type: calendar_dto_1.CalendarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Calendario no encontrado" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Datos inválidos" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, calendar_dto_1.UpdateCalendarDto]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Eliminar calendario" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID del calendario", type: "number" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Calendario eliminado exitosamente",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Calendario no encontrado" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)("validate/rules"),
    (0, swagger_1.ApiOperation)({
        summary: "Importar datos desde Excel y convertir a JSON estructurado",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        description: "Archivo Excel con datos de incidencias",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Datos del Excel convertidos a JSON exitosamente",
        schema: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        summary: { type: "object" },
                        employees: { type: "array" },
                        metadata: { type: "object" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Error en el archivo Excel" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "validateRule", null);
CalendarController = __decorate([
    (0, common_1.Controller)("calendar"),
    (0, swagger_1.ApiTags)("Calendar - Nóminas"),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
exports.CalendarController = CalendarController;
//# sourceMappingURL=calendar.controller.js.map