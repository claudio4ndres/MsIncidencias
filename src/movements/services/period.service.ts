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
      // Mapear nombres de meses en español a números
      const monthMap: { [key: string]: number } = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
      };
      
      const currentYear = new Date().getFullYear();
      
      // Caso 1: "al miércoles 25 diciembre" - Solo fecha final
      const singleDateMatch = rangeString.match(/^al\s+(\w+)\s+(\d{1,2})\s+(\w+)$/i);
      if (singleDateMatch) {
        const [, , endDay, endMonth] = singleDateMatch;
        const endMonthNum = monthMap[endMonth.toLowerCase()];
        
        if (endMonthNum === undefined) {
          throw new Error(`Mes no reconocido: ${endMonth}`);
        }
        
        // Para casos como "al 25 diciembre", asumimos que empieza el 1 del mismo mes
        const start = moment()
          .year(currentYear)
          .month(endMonthNum)
          .date(1)
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
        const start = moment()
          .year(currentYear)
          .month(endMonthNum)
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
        
        let startYear = currentYear;
        let endYear = currentYear;
        
        // Ajustar años para casos como "diciembre al enero" (cruce de año)
        if (startMonthNum === 11 && endMonthNum === 0) {
          endYear = currentYear + 1;
        } else if (startMonthNum > endMonthNum) {
          endYear = currentYear + 1;
        }
        
        const start = moment()
          .year(startYear)
          .month(startMonthNum)
          .date(parseInt(startDay))
          .startOf('day')
          .tz('America/Mexico_City')
          .toDate();
          
        const end = moment()
          .year(endYear)
          .month(endMonthNum)
          .date(parseInt(endDay))
          .endOf('day')
          .tz('America/Mexico_City')
          .toDate();
        
        return { start, end };
      }
      
      // Fallback: intentar formato DD/MM/YYYY
      if (rangeString.includes(' - ')) {
        const [startStr, endStr] = rangeString.split(' - ');
        const start = moment(startStr, 'DD/MM/YYYY').tz('America/Mexico_City').startOf('day').toDate();
        const end = moment(endStr, 'DD/MM/YYYY').tz('America/Mexico_City').endOf('day').toDate();
        return { start, end };
      }
      
      throw new Error(`No se pudo parsear el rango: ${rangeString}`);
    } catch (error) {
      console.error(`Error parsing range '${rangeString}':`, error);
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
