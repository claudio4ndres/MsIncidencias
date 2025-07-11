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
exports.CalendarRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_entity_1 = require("./entities/calendar.entity");
let CalendarRepository = class CalendarRepository {
    constructor(calendarRepository) {
        this.calendarRepository = calendarRepository;
    }
    async create(calendar) {
        const newCalendar = this.calendarRepository.create(calendar);
        return await this.calendarRepository.save(newCalendar);
    }
    async findAll() {
        return await this.calendarRepository.find();
    }
    async findOne(id) {
        return await this.calendarRepository.findOne({ where: { id } });
    }
    async findByPeriod(period) {
        return await this.calendarRepository.findOne({ where: { period } });
    }
    async findByMonth(month) {
        return await this.calendarRepository.find({ where: { month } });
    }
    async update(id, updateData) {
        await this.calendarRepository.update(id, updateData);
        return await this.findOne(id);
    }
    async delete(id) {
        const result = await this.calendarRepository.delete(id);
        return result.affected > 0;
    }
    async bulkCreate(calendars) {
        const newCalendars = this.calendarRepository.create(calendars);
        return await this.calendarRepository.save(newCalendars);
    }
    async findByDateRange(startDate, endDate) {
        return await this.calendarRepository
            .createQueryBuilder('calendar')
            .where('calendar.incidentSubmission BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orWhere('calendar.process BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orWhere('calendar.policyGeneration BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orWhere('calendar.payment BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('calendar.incidentSubmission', 'ASC')
            .getMany();
    }
};
CalendarRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_entity_1.Calendar)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarRepository);
exports.CalendarRepository = CalendarRepository;
//# sourceMappingURL=calendar.repository.js.map