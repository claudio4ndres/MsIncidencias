import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import "moment/locale/es-mx";
import { BulkCreateCalendarDto, CreateCalendarDto, UpdateCalendarDto } from "./dto/calendar.dto";
export declare class CalendarService {
    private readonly calendarRepository;
    constructor(calendarRepository: CalendarRepository);
    findAll(): Promise<Calendar[]>;
    findOne(id: number): Promise<Calendar>;
    findByPeriod(period: string): Promise<Calendar>;
    findByMonth(month: string): Promise<Calendar[]>;
    create(createCalendarDto: CreateCalendarDto): Promise<Calendar>;
    update(id: number, updateCalendarDto: UpdateCalendarDto): Promise<Calendar>;
    delete(id: number): Promise<void>;
    bulkCreate(bulkCreateDto: BulkCreateCalendarDto): Promise<Calendar[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Calendar[]>;
    importFromExcel(excelData: any[]): Promise<Calendar[]>;
    validateRules(excelData: any[]): Promise<any>;
}
