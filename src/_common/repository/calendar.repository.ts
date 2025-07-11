import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './entities/calendar.entity';

@Injectable()
export class CalendarRepository {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  async create(calendar: Partial<Calendar>): Promise<Calendar> {
    const newCalendar = this.calendarRepository.create(calendar);
    return await this.calendarRepository.save(newCalendar);
  }

  async findAll(): Promise<Calendar[]> {
    return await this.calendarRepository.find();
  }

  async findOne(id: number): Promise<Calendar | null> {
    return await this.calendarRepository.findOne({ where: { id } });
  }

  async findByPeriod(period: string): Promise<Calendar | null> {
    return await this.calendarRepository.findOne({ where: { period } });
  }

  async findByMonth(month: string): Promise<Calendar[]> {
    return await this.calendarRepository.find({ where: { month } });
  }

  async update(id: number, updateData: Partial<Calendar>): Promise<Calendar | null> {
    await this.calendarRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.calendarRepository.delete(id);
    return result.affected > 0;
  }

  async bulkCreate(calendars: Partial<Calendar>[]): Promise<Calendar[]> {
    const newCalendars = this.calendarRepository.create(calendars);
    return await this.calendarRepository.save(newCalendars);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Calendar[]> {
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
}
