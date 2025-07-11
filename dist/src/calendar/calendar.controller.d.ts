/// <reference types="multer" />
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import { CalendarService } from "./calendar.service";
import { BulkCreateCalendarDto, CreateCalendarDto, UpdateCalendarDto } from "./dto/calendar.dto";
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    findAll(): Promise<Calendar[]>;
    findByPeriod(period: string): Promise<Calendar>;
    findByMonth(month: string): Promise<Calendar[]>;
    findByDateRange(startDate: string, endDate: string): Promise<Calendar[]>;
    findOne(id: number): Promise<Calendar>;
    create(createCalendarDto: CreateCalendarDto): Promise<Calendar>;
    bulkCreate(bulkCreateDto: BulkCreateCalendarDto): Promise<Calendar[]>;
    importFromExcel(file: Express.Multer.File): Promise<Calendar[]>;
    update(id: number, updateCalendarDto: UpdateCalendarDto): Promise<Calendar>;
    delete(id: number): Promise<{
        message: string;
    }>;
    validateRule(file: Express.Multer.File): Promise<any>;
}
