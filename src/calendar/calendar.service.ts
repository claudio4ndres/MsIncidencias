import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import moment from "moment";
import "moment/locale/es-mx";
import {
  BulkCreateCalendarDto,
  CreateCalendarDto,
  UpdateCalendarDto,
} from "./dto/calendar.dto";
import { excelSerialDateToDate } from "./helpers/excel-date.helper";

// Configurar moment para usar locale español mexicano
moment.locale("es-mx");

// Interfaz para el calendario extendido con información de semana
interface CalendarWithWeek extends Calendar {
  semana: number;
  semanasEnAnio: number;
}

@Injectable()
export class CalendarService {
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async findAll(): Promise<Calendar[]> {
    return await this.calendarRepository.findAll();
  }
  async findOne(id: number): Promise<Calendar> {
    const calendar = await this.calendarRepository.findOne(id);
    if (!calendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return calendar;
  }

  async findByPeriod(period: string): Promise<Calendar> {
    const calendar = await this.calendarRepository.findByPeriod(period);
    if (!calendar) {
      throw new NotFoundException(`Calendar with period ${period} not found`);
    }
    return calendar;
  }

  async findByMonth(month: string): Promise<Calendar[]> {
    return await this.calendarRepository.findByMonth(month);
  }

  async create(createCalendarDto: CreateCalendarDto): Promise<Calendar> {
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

  async update(
    id: number,
    updateCalendarDto: UpdateCalendarDto
  ): Promise<Calendar> {
    const existingCalendar = await this.findOne(id);

    const updateData: Partial<Calendar> = {};

    if (updateCalendarDto.month) updateData.month = updateCalendarDto.month;
    if (updateCalendarDto.period) updateData.period = updateCalendarDto.period;
    if (updateCalendarDto.range) updateData.range = updateCalendarDto.range;
    if (updateCalendarDto.incidentSubmission)
      updateData.incidentSubmission = new Date(
        updateCalendarDto.incidentSubmission
      );
    if (updateCalendarDto.process)
      updateData.process = new Date(updateCalendarDto.process);
    if (updateCalendarDto.policyGeneration)
      updateData.policyGeneration = new Date(
        updateCalendarDto.policyGeneration
      );
    if (updateCalendarDto.payment)
      updateData.payment = new Date(updateCalendarDto.payment);

    const updatedCalendar = await this.calendarRepository.update(
      id,
      updateData
    );
    if (!updatedCalendar) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
    return updatedCalendar;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.calendarRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Calendar with ID ${id} not found`);
    }
  }

  async bulkCreate(bulkCreateDto: BulkCreateCalendarDto): Promise<Calendar[]> {
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

  async findByDateRange(startDate: Date, endDate: Date): Promise<Calendar[]> {
    return await this.calendarRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Importa datos desde Excel usando números de serie de Excel para las fechas
   * @param excelData Array de objetos con datos del Excel
   */
  async importFromExcel(excelData: any[]): Promise<Calendar[]> {
    try {
      const calendarsData = excelData.map((row) => {
        if (
          !row.MES ||
          !row.PERIODO ||
          !row["DESDE HASTA"] ||
          !row["ENTREGA INCIDENCIAS"] ||
          !row.PROCESO ||
          !row["CIERRE Y GENERACION DE POLIZAS"] ||
          !row.PAGO
        ) {
          throw new BadRequestException(
            "Missing required fields in Excel data"
          );
        }

        return {
          month: row.MES,
          period: row.PERIODO.toString(),
          range: row["DESDE HASTA"],
          incidentSubmission: excelSerialDateToDate(row["ENTREGA INCIDENCIAS"]),
          process: excelSerialDateToDate(row.PROCESO),
          policyGeneration: excelSerialDateToDate(
            row["CIERRE Y GENERACION DE POLIZAS"]
          ),
          payment: excelSerialDateToDate(row.PAGO),
        };
      });

      return await this.calendarRepository.bulkCreate(calendarsData);
    } catch (error) {
      throw new BadRequestException(
        `Error importing Excel data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Convierte los datos importados desde Excel a JSON
   * @param excelData Array de objetos con datos del Excel
   */
  async validateRules(excelData: any[]): Promise<any> {
    return "validar reglas";
  }
}
