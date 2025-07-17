import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './entities/holiday.entity';

@Injectable()
export class HolidayRepository {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  async findAll(): Promise<Holiday[]> {
    return await this.holidayRepository.find({ where: { active: true } });
  }

  async findByDate(fecha: string): Promise<Holiday | null> {
    return await this.holidayRepository.findOne({ 
      where: { fecha, active: true } 
    });
  }

  async isHoliday(fecha: string): Promise<boolean> {
    const holiday = await this.findByDate(fecha);
    return holiday !== null;
  }

  async create(holiday: Partial<Holiday>): Promise<Holiday> {
    const newHoliday = this.holidayRepository.create(holiday);
    return await this.holidayRepository.save(newHoliday);
  }

  async update(id: number, updateData: Partial<Holiday>): Promise<Holiday | null> {
    await this.holidayRepository.update(id, updateData);
    return await this.holidayRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.holidayRepository.delete(id);
    return result.affected > 0;
  }
}
