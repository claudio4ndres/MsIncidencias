import { Injectable } from '@nestjs/common';
import { CalendarRepository } from '../../_common/repository';
import { Calendar } from '../../_common/repository/entities/calendar.entity';
import moment from 'moment-timezone';

@Injectable()
export class PeriodService {
  constructor(
    private readonly calendarRepository: CalendarRepository
  ) {}

  /**
   * Obtiene el período al que pertenece una fecha específica
   */
  async findPeriodByDate(date: Date): Promise<Calendar | null> {
    const allPeriods = await this.calendarRepository.findAll();
    
    for (const period of allPeriods) {
      const periodRange = this.parsePeriodRange(period.range);
      if (this.isDateInRange(date, periodRange.start, periodRange.end)) {
        return period;
      }
    }
    
    return null;
  }

  /**
   * Verifica si una fecha está en un período anterior al período actual
   */
  async isDateInPreviousPeriod(date: Date, currentPeriod: string): Promise<boolean> {
    const currentPeriodEntity = await this.calendarRepository.findByPeriod(currentPeriod);
    if (!currentPeriodEntity) {
      return false;
    }
    
    const currentPeriodRange = this.parsePeriodRange(currentPeriodEntity.range);
    return date < currentPeriodRange.start;
  }

  /**
   * Obtiene todos los períodos anteriores al período actual
   */
  async getPreviousPeriods(currentPeriod: string): Promise<Calendar[]> {
    const currentPeriodEntity = await this.calendarRepository.findByPeriod(currentPeriod);
    if (!currentPeriodEntity) {
      return [];
    }
    
    const allPeriods = await this.calendarRepository.findAll();
    const currentPeriodRange = this.parsePeriodRange(currentPeriodEntity.range);
    
    return allPeriods.filter(period => {
      const periodRange = this.parsePeriodRange(period.range);
      return periodRange.end < currentPeriodRange.start;
    }).sort((a, b) => {
      const aRange = this.parsePeriodRange(a.range);
      const bRange = this.parsePeriodRange(b.range);
      return bRange.start.getTime() - aRange.start.getTime(); // Más reciente primero
    });
  }

  /**
   * Parsea el rango de fechas del período
   */
  private parsePeriodRange(rangeString: string): { start: Date; end: Date } {
    try {
      // Regex para extraer los números de día y meses
      const regex = /(\w+)\s+(\d+)\s+(\w+)\s+al\s+(\w+)\s+(\d+)\s+(\w+)/i;
      const match = rangeString.match(regex);
      
      if (!match) {
        throw new Error(`No se pudo parsear el rango: ${rangeString}`);
      }
      
      const [, , startDay, startMonth, , endDay, endMonth] = match;
      
      // Mapear nombres de meses en español a números
      const monthMap: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
      };
      
      const currentYear = new Date().getFullYear();
      
      const startMonthNum = monthMap[startMonth.toLowerCase()];
      const endMonthNum = monthMap[endMonth.toLowerCase()];
      
      if (startMonthNum === undefined || endMonthNum === undefined) {
        throw new Error(`Mes no reconocido en: ${rangeString}`);
      }
      
      const start = moment()
        .year(currentYear)
        .month(startMonthNum)
        .date(parseInt(startDay))
        .startOf('day')
        .tz('America/Mexico_City')
        .toDate();
      
      const end = moment()
        .year(currentYear)
        .month(endMonthNum)
        .date(parseInt(endDay))
        .endOf('day')
        .tz('America/Mexico_City')
        .toDate();
      
      return { start, end };
    } catch (error) {
      // Fallback: intentar formato DD/MM/YYYY
      console.warn(`Error parsing range '${rangeString}', trying fallback format:`, error);
      
      if (rangeString.includes(' - ')) {
        const [startStr, endStr] = rangeString.split(' - ');
        const start = moment(startStr, 'DD/MM/YYYY').tz('America/Mexico_City').startOf('day').toDate();
        const end = moment(endStr, 'DD/MM/YYYY').tz('America/Mexico_City').endOf('day').toDate();
        return { start, end };
      }
      
      throw new Error(`No se pudo parsear el rango de fechas: ${rangeString}`);
    }
  }

  /**
   * Verifica si una fecha está dentro de un rango
   */
  private isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }
}
