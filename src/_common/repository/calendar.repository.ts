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
    console.log('CalendarRepository.findAll() - Ejecutando consulta');
    const result = await this.calendarRepository.find();
    console.log(`CalendarRepository.findAll() - Registros encontrados: ${result.length}`);
    console.log('Registros:', result.map(r => ({ id: r.id, period: r.period, status: r.calendarStatus })));
    return result;
  }

  async findAllPaginated(options: {
    skip?: number;
    take?: number;
    order?: any;
    search?: string;
  }): Promise<[Calendar[], number]> {
    const { skip = 0, take = 10, order = { period: 'ASC' }, search = '' } = options;
    
    console.log('CalendarRepository.findAllPaginated() - Ejecutando consulta paginada');
    console.log('Parámetros:', { skip, take, order, search });
    
    const queryBuilder = this.calendarRepository.createQueryBuilder('calendar');
    
    // Agregar filtro de búsqueda si se proporciona
    if (search) {
      queryBuilder.where('calendar.period LIKE :search OR calendar.month LIKE :search', {
        search: `%${search}%`
      });
    }
    
    // Agregar ordenamiento
    if (order) {
      Object.keys(order).forEach(key => {
        queryBuilder.addOrderBy(`calendar.${key}`, order[key]);
      });
    }
    
    // Agregar paginación
    queryBuilder.skip(skip).take(take);
    
    const [result, total] = await queryBuilder.getManyAndCount();
    
    console.log(`CalendarRepository.findAllPaginated() - Registros encontrados: ${result.length} de ${total}`);
    console.log('Registros:', result.map(r => ({ id: r.id, period: r.period, status: r.calendarStatus })));
    
    return [result, total];
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

  async findCurrentPeriod(startOfDay: Date, endOfDay: Date): Promise<Calendar | null> {
    // Obtener todos los períodos y verificar cuál contiene la fecha actual
    const allPeriods = await this.calendarRepository.find();
    
    for (const period of allPeriods) {
      if (this.isCurrentDateInPeriodRange(period.range, startOfDay, period.incidentSubmission.getFullYear())) {
        return period;
      }
    }
    
    return null;
  }

  private isCurrentDateInPeriodRange(rangeString: string, currentDate: Date, year: number): boolean {
    try {
      // Parsear el rango para obtener las fechas de inicio y fin
      const { periodStart, periodEnd } = this.parsePeriodRange(rangeString, year);
      
      // Verificar si la fecha actual está dentro del rango
      return currentDate >= periodStart && currentDate <= periodEnd;
    } catch (error) {
      console.error(`Error parsing range '${rangeString}':`, error);
      return false;
    }
  }

  private parsePeriodRange(rangeString: string, year: number): { periodStart: Date; periodEnd: Date } {
    try {
      const monthMap: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
      };

      // Caso 1: "al miércoles 25 diciembre" - Solo fecha final
      const singleDateMatch = rangeString.match(/^al\s+(\w+)\s+(\d{1,2})\s+(\w+)$/i);
      if (singleDateMatch) {
        const [, , endDay, endMonth] = singleDateMatch;
        const endMonthNum = monthMap[endMonth.toLowerCase()];
        
        if (endMonthNum === undefined) {
          throw new Error(`Mes no reconocido: ${endMonth}`);
        }
        
        // Para casos como "al 25 diciembre", asumimos que empieza el 1 del mismo mes
        const periodStart = new Date(year, endMonthNum, 1, 0, 0, 0);
        const periodEnd = new Date(year, endMonthNum, parseInt(endDay), 23, 59, 59, 999);
        
        return { periodStart, periodEnd };
      }

      // Caso 2: "viernes 6 al jueves 12 junio" - Sin mes en la primera fecha
      const partialMatch = rangeString.match(/(\w+)\s+(\d{1,2})\s+al\s+(\w+)\s+(\d{1,2})\s+(\w+)/i);
      if (partialMatch) {
        const [, , startDay, , endDay, endMonth] = partialMatch;
        const endMonthNum = monthMap[endMonth.toLowerCase()];
        
        if (endMonthNum === undefined) {
          throw new Error(`Mes no reconocido: ${endMonth}`);
        }
        
        // La fecha de inicio usa el mismo mes que la fecha final
        const periodStart = new Date(year, endMonthNum, parseInt(startDay), 0, 0, 0);
        const periodEnd = new Date(year, endMonthNum, parseInt(endDay), 23, 59, 59, 999);
        
        return { periodStart, periodEnd };
      }

      // Caso 3: "jueves 26 diciembre al jueves 2 enero" - Formato completo
      const fullMatch = rangeString.match(/(\w+)\s+(\d{1,2})\s+(\w+)\s+al?\s+(\w+)\s+(\d{1,2})\s+(\w+)/i);
      if (fullMatch) {
        const [, , startDay, startMonth, , endDay, endMonth] = fullMatch;
        
        const startMonthNum = monthMap[startMonth.toLowerCase()];
        const endMonthNum = monthMap[endMonth.toLowerCase()];
        
        if (startMonthNum === undefined || endMonthNum === undefined) {
          throw new Error(`Mes no reconocido en: ${rangeString}`);
        }
        
        let startYear = year;
        let endYear = year;
        
        // Ajustar años para casos como "diciembre al enero" (cruce de año)
        if (startMonthNum === 11 && endMonthNum === 0) {
          endYear = year + 1;
        } else if (startMonthNum > endMonthNum) {
          endYear = year + 1;
        }
        
        const periodStart = new Date(startYear, startMonthNum, parseInt(startDay), 0, 0, 0);
        const periodEnd = new Date(endYear, endMonthNum, parseInt(endDay), 23, 59, 59, 999);
        
        return { periodStart, periodEnd };
      }

      throw new Error(`No se pudo parsear el rango: ${rangeString}`);
    } catch (error) {
      throw error;
    }
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
