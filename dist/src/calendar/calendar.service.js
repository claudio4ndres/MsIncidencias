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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const calendar_repository_1 = require("../_common/repository/calendar.repository");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/es-mx");
const excel_date_helper_1 = require("./helpers/excel-date.helper");
moment_1.default.locale("es-mx");
let CalendarService = class CalendarService {
    constructor(calendarRepository) {
        this.calendarRepository = calendarRepository;
    }
    async findAll() {
        return await this.calendarRepository.findAll();
    }
    async findOne(id) {
        const calendar = await this.calendarRepository.findOne(id);
        if (!calendar) {
            throw new common_1.NotFoundException(`Calendar with ID ${id} not found`);
        }
        return calendar;
    }
    async findByPeriod(period) {
        const calendar = await this.calendarRepository.findByPeriod(period);
        if (!calendar) {
            throw new common_1.NotFoundException(`Calendar with period ${period} not found`);
        }
        return calendar;
    }
    async findByMonth(month) {
        return await this.calendarRepository.findByMonth(month);
    }
    async create(createCalendarDto) {
        const calendarData = {
            month: createCalendarDto.month,
            period: createCalendarDto.period,
            range: createCalendarDto.range,
            incidentSubmission: new Date(createCalendarDto.incidentSubmission),
            process: new Date(createCalendarDto.process),
            policyGeneration: new Date(createCalendarDto.policyGeneration),
            payment: new Date(createCalendarDto.payment),
        };
        return await this.calendarRepository.create(calendarData);
    }
    async update(id, updateCalendarDto) {
        const existingCalendar = await this.findOne(id);
        const updateData = {};
        if (updateCalendarDto.month)
            updateData.month = updateCalendarDto.month;
        if (updateCalendarDto.period)
            updateData.period = updateCalendarDto.period;
        if (updateCalendarDto.range)
            updateData.range = updateCalendarDto.range;
        if (updateCalendarDto.incidentSubmission)
            updateData.incidentSubmission = new Date(updateCalendarDto.incidentSubmission);
        if (updateCalendarDto.process)
            updateData.process = new Date(updateCalendarDto.process);
        if (updateCalendarDto.policyGeneration)
            updateData.policyGeneration = new Date(updateCalendarDto.policyGeneration);
        if (updateCalendarDto.payment)
            updateData.payment = new Date(updateCalendarDto.payment);
        const updatedCalendar = await this.calendarRepository.update(id, updateData);
        if (!updatedCalendar) {
            throw new common_1.NotFoundException(`Calendar with ID ${id} not found`);
        }
        return updatedCalendar;
    }
    async delete(id) {
        const deleted = await this.calendarRepository.delete(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Calendar with ID ${id} not found`);
        }
    }
    async bulkCreate(bulkCreateDto) {
        const calendarsData = bulkCreateDto.calendars.map((calendar) => ({
            month: calendar.month,
            period: calendar.period,
            range: calendar.range,
            incidentSubmission: new Date(calendar.incidentSubmission),
            process: new Date(calendar.process),
            policyGeneration: new Date(calendar.policyGeneration),
            payment: new Date(calendar.payment),
        }));
        return await this.calendarRepository.bulkCreate(calendarsData);
    }
    async findByDateRange(startDate, endDate) {
        return await this.calendarRepository.findByDateRange(startDate, endDate);
    }
    async importFromExcel(excelData) {
        try {
            const calendarsData = excelData.map((row) => {
                if (!row.MES ||
                    !row.PERIODO ||
                    !row["DESDE HASTA"] ||
                    !row["ENTREGA INCIDENCIAS"] ||
                    !row.PROCESO ||
                    !row["CIERRE Y GENERACION DE POLIZAS"] ||
                    !row.PAGO) {
                    throw new common_1.BadRequestException("Missing required fields in Excel data");
                }
                return {
                    month: row.MES,
                    period: row.PERIODO.toString(),
                    range: row["DESDE HASTA"],
                    incidentSubmission: (0, excel_date_helper_1.excelSerialDateToDate)(row["ENTREGA INCIDENCIAS"]),
                    process: (0, excel_date_helper_1.excelSerialDateToDate)(row.PROCESO),
                    policyGeneration: (0, excel_date_helper_1.excelSerialDateToDate)(row["CIERRE Y GENERACION DE POLIZAS"]),
                    payment: (0, excel_date_helper_1.excelSerialDateToDate)(row.PAGO),
                };
            });
            return await this.calendarRepository.bulkCreate(calendarsData);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error importing Excel data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async validateRules(excelData) {
        return "validar reglas";
    }
};
CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [calendar_repository_1.CalendarRepository])
], CalendarService);
exports.CalendarService = CalendarService;
//# sourceMappingURL=calendar.service.js.map