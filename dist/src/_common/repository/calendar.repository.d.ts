import { Repository } from 'typeorm';
import { Calendar } from './entities/calendar.entity';
export declare class CalendarRepository {
    private readonly calendarRepository;
    constructor(calendarRepository: Repository<Calendar>);
    create(calendar: Partial<Calendar>): Promise<Calendar>;
    findAll(): Promise<Calendar[]>;
    findOne(id: number): Promise<Calendar | null>;
    findByPeriod(period: string): Promise<Calendar | null>;
    findByMonth(month: string): Promise<Calendar[]>;
    update(id: number, updateData: Partial<Calendar>): Promise<Calendar | null>;
    delete(id: number): Promise<boolean>;
    bulkCreate(calendars: Partial<Calendar>[]): Promise<Calendar[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Calendar[]>;
}
