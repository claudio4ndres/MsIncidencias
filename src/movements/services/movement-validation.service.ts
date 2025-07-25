import { BadRequestException, Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { Between, LessThan } from "typeorm";
import { WeekDay, WEEKDAY_NAMES } from "../../_common/enums/weekday.enum";
import {
  CalendarRepository,
  HolidayRepository,
  MovementRepository,
} from "../../_common/repository";
import { ApprovalRepository } from "../../_common/repository/approval.repository";
import { EmployeeEntity } from "../../_common/repository/entities/employee.entity";
import {
  INCIDENT_CODE_TO_NAME,
  IncidentCode,
  UNIQUE_INCIDENT_CODES,
} from "../enums/incident-codes.enum";
import { ApprovalService } from "./approval.service";

// Configurar moment con locale español
moment.locale("es");

@Injectable()
export class MovementValidationService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly holidayRepository: HolidayRepository,
    private readonly movementRepository: MovementRepository,
    private readonly approvalRepository: ApprovalRepository,
    private readonly approvalService: ApprovalService
  ) {}

  /**
   * Valida las reglas de negocio para la creación de movimientos
   */
  async validateMovementBusinessRules(
    employeeCode: number,
    incidentCode: string,
    incidenceDate: string,
    period: string,
    employee: EmployeeEntity,
    movementId?: string,
    requestedBy?: string
  ): Promise<void> {
    // Convertir fecha a timezone de México
    const mexicoDate = moment(incidenceDate).tz("America/Mexico_City");
    const dateString = mexicoDate.format("D [de] MMMM").toLowerCase();

    // 1. Validar que el período existe en el calendario
    const calendarPeriod = await this.calendarRepository.findByPeriod(period);
    if (!calendarPeriod) {
      throw new BadRequestException(
        `El período ${period} no existe en el calendario de nómina`
      );
    }

    // 2. Validar que la fecha está dentro del rango del período
    const periodRange = this.parsePeriodRange(calendarPeriod.range);
    if (
      !this.isDateInRange(
        mexicoDate.toDate(),
        periodRange.start,
        periodRange.end
      )
    ) {
      throw new BadRequestException(
        `La fecha ${mexicoDate.format(
          "DD/MM/YYYY"
        )} no está dentro del rango del período ${period} (${
          calendarPeriod.range
        })`
      );
    }

    // 3. Validación automática de duplicados para incidentes que requieren unicidad por fecha
    await this.validateDuplicateIncidentsForDate(
      employeeCode,
      incidentCode,
      mexicoDate
    );

    // 4. Validar reglas específicas por tipo de incidente
    switch (incidentCode) {
      case IncidentCode.DESCANSO_TRABAJADO:
        await this.validateDescansoTrabajado(
          employeeCode,
          incidenceDate,
          period,
          dateString,
          employee
        );
        break;
      case IncidentCode.PRIMA_DOMINICAL:
        await this.validatePrimaDominical(
          employeeCode,
          incidenceDate,
          period,
          employee,
          mexicoDate
        );
        break;
      case IncidentCode.DIA_DEVUELTO:
        await this.validateDiaDevuelto(
          employeeCode,
          incidenceDate,
          period,
          movementId,
          requestedBy
        );
        break;
      case IncidentCode.FALTA:
        await this.validateFalta(
          employeeCode,
          incidenceDate,
          period,
          dateString
        );
        break;
      default:
        break;
    }
  }

  /**
   * Valida automáticamente que no existan duplicados para incidentes que requieren unicidad por fecha
   */
  private async validateDuplicateIncidentsForDate(
    employeeCode: number,
    incidentCode: string,
    mexicoDate: moment.Moment
  ): Promise<void> {
    if (UNIQUE_INCIDENT_CODES.includes(incidentCode as any)) {
      const existingMovement = await this.movementRepository.findOne({
        where: {
          employeeCode,
          incidentCode,
          incidenceDate: mexicoDate.toDate(),
        },
      });

      if (existingMovement) {
        const incidentName =
          INCIDENT_CODE_TO_NAME[incidentCode] || "movimiento";
        throw new BadRequestException(
          `Ya existe un ${incidentName} registrado para esta fecha`
        );
      }
    }
  }

  /**
   * Valida reglas para Descansos Trabajados (005)
   */
  private async validateDescansoTrabajado(
    employeeCode: number,
    incidenceDate: string,
    period: string,
    dateString: string,
    employee: EmployeeEntity
  ): Promise<void> {
    // 1. Verificar que no exista una falta en el mismo período
    // Obtener el rango de fechas del período para filtrar correctamente
    const calendarPeriod = await this.calendarRepository.findByPeriod(period);
    if (calendarPeriod) {
      const periodRange = this.parsePeriodRange(calendarPeriod.range);

      const faltaEnPeriodo = await this.movementRepository.findOne({
        where: {
          employeeCode,
          incidentCode: "215", // Faltas
          incidenceDate: Between(periodRange.start, periodRange.end),
        },
      });

      if (faltaEnPeriodo) {
        throw new BadRequestException(
          "No se puede registrar un descanso trabajado si el empleado tiene una falta en el mismo período"
        );
      }
    }

    // 2. Verificar que la fecha corresponde a un día festivo
    const isHoliday = await this.holidayRepository.isHoliday(dateString);
    if (!isHoliday) {
      throw new BadRequestException(
        "La fecha del descanso trabajado debe corresponder a un día festivo"
      );
    }

    // 3. Validar día de descanso semanal (Regla 6)
    const mexicoDate = moment(incidenceDate).tz("America/Mexico_City");
    const descansoTrabajadoDay = mexicoDate.day(); // 0=domingo, 1=lunes, etc.

    if (employee.weeklyRestDay === descansoTrabajadoDay) {
      const dayName = WEEKDAY_NAMES[employee.weeklyRestDay];
      throw new BadRequestException(
        `No se puede registrar descanso trabajado en ${dayName} porque es el día de descanso semanal del empleado`
      );
    }
  }

  /**
   * Valida reglas para Prima Dominical (008)
   */
  private async validatePrimaDominical(
    employeeCode: number,
    incidenceDate: string,
    period: string,
    employee: EmployeeEntity,
    mexicoDate: moment.Moment
  ): Promise<void> {
    // 1. Verificar que el empleado es elegible (SIND o CONF con puestos específicos)
    const eligibleEmployeeTypes = ["SIND"];
    const eligiblePositions = [
      "monitoristas play city",
      "oper atención telefónica",
    ];

    const isEligible =
      eligibleEmployeeTypes.includes(employee.employeeType) ||
      (employee.employeeType === "CONF" &&
        eligiblePositions.some((pos) =>
          employee.employeeName.toLowerCase().includes(pos)
        ));

    if (!isEligible) {
      throw new BadRequestException(
        "Prima dominical aplica solo para empleados SIND o personal CONF con puestos específicos (monitoristas play city, oper atención telefónica)"
      );
    }

    // 2. Verificar que la fecha es domingo
    if (mexicoDate.day() !== 0) {
      throw new BadRequestException(
        "La fecha de la prima dominical debe ser un domingo"
      );
    }

    // 3. Verificar que corresponde al domingo del período de nómina
    const calendarPeriod = await this.calendarRepository.findByPeriod(period);
    if (calendarPeriod) {
      const periodRange = this.parsePeriodRange(calendarPeriod.range);
      const periodSunday = this.findSundayInPeriod(
        periodRange.start,
        periodRange.end
      );

      if (!periodSunday || !mexicoDate.isSame(periodSunday, "day")) {
        throw new BadRequestException(
          "La fecha de la prima dominical debe corresponder al domingo del período de nómina"
        );
      }
    }

    // 4. Validar día de descanso semanal (Regla 6)
    if (employee.weeklyRestDay === WeekDay.DOMINGO) {
      throw new BadRequestException(
        "Los empleados con prima dominical no pueden tener domingo como día de descanso semanal. El día de descanso semanal debe ser de lunes a sábado."
      );
    }
  }

  /**
   * Valida reglas para Días Devueltos (009)
   */
  private async validateDiaDevuelto(
    employeeCode: number,
    incidenceDate: string,
    period: string,
    movementId?: string,
    requestedBy?: string
  ): Promise<void> {
    const mexicoDate = moment(incidenceDate).tz("America/Mexico_City");

    // 1. Obtener el período actual y sus fechas
    const currentPeriod = await this.calendarRepository.findByPeriod(period);
    if (!currentPeriod) {
      throw new BadRequestException(`El período ${period} no existe`);
    }

    const currentPeriodRange = this.parsePeriodRange(currentPeriod.range);

    // 2. Buscar falta anterior que corresponda a la fecha del día devuelto
    // Primero buscar en el período actual
    let faltaAnterior = await this.movementRepository.findOne({
      where: {
        employeeCode,
        incidentCode: "215", // Faltas
        incidenceDate: mexicoDate.toDate(),
      },
    });

    let isPreviousPeriod = false;

    // Si no se encuentra en el período actual, buscar en períodos anteriores
    if (!faltaAnterior) {
      faltaAnterior = await this.movementRepository.findOne({
        where: {
          employeeCode,
          incidentCode: "215", // Faltas
          incidenceDate: LessThan(currentPeriodRange.start),
        },
        order: {
          incidenceDate: "DESC",
        },
      });

      if (faltaAnterior) {
        isPreviousPeriod = true;
      }
    }

    if (!faltaAnterior) {
      throw new BadRequestException(
        "No se puede registrar un día devuelto sin una falta anterior registrada que corresponda a la fecha"
      );
    }

    // 3. Si la falta es de un período anterior, manejar el proceso de aprobación
    if (isPreviousPeriod) {
      const hasApproval = await this.approvalService.hasApprovedDiaDevuelto(
        faltaAnterior.id
      );

      if (!hasApproval) {
        // Crear automáticamente la solicitud de aprobación si no existe
        if (movementId && requestedBy) {
          const approval =
            await this.approvalService.createOrFindDiaDevueltoApproval(
              movementId,
              requestedBy,
              faltaAnterior.id
            );

          throw new BadRequestException(
            `Se ha creado una solicitud de aprobación (ID: ${approval.id}) para el día devuelto de período anterior. ` +
              `Se requieren ${approval.requiredApprovals} aprobaciones del director de RH. ` +
              `Aprobaciones actuales: ${approval.currentApprovalCount}/${approval.requiredApprovals}.`
          );
        } else {
          throw new BadRequestException(
            "Para registrar un día devuelto de un período anterior se requiere aprobación del director de RH."
          );
        }
      }
    }
  }

  /**
   * Valida reglas para Faltas (215)
   */
  private async validateFalta(
    employeeCode: number,
    incidenceDate: string,
    period: string,
    dateString: string
  ): Promise<void> {
    // 1. Verificar que no es día festivo
    const isHoliday = await this.holidayRepository.isHoliday(dateString);
    if (isHoliday) {
      throw new BadRequestException(
        "No se puede registrar una falta en un día festivo"
      );
    }

    // 2. Verificar que no existe un descanso trabajado en el mismo período
    const calendarPeriod = await this.calendarRepository.findByPeriod(period);
    if (calendarPeriod) {
      const periodRange = this.parsePeriodRange(calendarPeriod.range);

      const descansoEnPeriodo = await this.movementRepository.findOne({
        where: {
          employeeCode,
          incidentCode: "005", // Descansos Trabajados
          incidenceDate: Between(periodRange.start, periodRange.end),
        },
      });

      if (descansoEnPeriodo) {
        throw new BadRequestException(
          "No se puede registrar una falta si el empleado tiene un descanso trabajado en el mismo período"
        );
      }
    }
  }

  /**
   * Parsea el rango de fechas del período
   */
  private parsePeriodRange(rangeString: string): { start: Date; end: Date } {
    try {
      // Mapear nombres de meses en español a números
      const monthMap: { [key: string]: number } = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
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
          .startOf("day")
          .tz("America/Mexico_City")
          .toDate();
          
        const end = moment()
          .year(currentYear)
          .month(endMonthNum)
          .date(parseInt(endDay))
          .endOf("day")
          .tz("America/Mexico_City")
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
          .startOf("day")
          .tz("America/Mexico_City")
          .toDate();
          
        const end = moment()
          .year(currentYear)
          .month(endMonthNum)
          .date(parseInt(endDay))
          .endOf("day")
          .tz("America/Mexico_City")
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
          .startOf("day")
          .tz("America/Mexico_City")
          .toDate();
          
        const end = moment()
          .year(endYear)
          .month(endMonthNum)
          .date(parseInt(endDay))
          .endOf("day")
          .tz("America/Mexico_City")
          .toDate();
        
        return { start, end };
      }
      
      // Fallback: intentar formato DD/MM/YYYY
      if (rangeString.includes(" - ")) {
        const [startStr, endStr] = rangeString.split(" - ");
        const start = moment(startStr, "DD/MM/YYYY")
          .tz("America/Mexico_City")
          .startOf("day")
          .toDate();
        const end = moment(endStr, "DD/MM/YYYY")
          .tz("America/Mexico_City")
          .endOf("day")
          .toDate();
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

  /**
   * Encuentra el domingo dentro de un período
   */
  private findSundayInPeriod(start: Date, end: Date): moment.Moment | null {
    const startMoment = moment(start).tz("America/Mexico_City");
    const endMoment = moment(end).tz("America/Mexico_City");

    for (
      let current = startMoment.clone();
      current.isSameOrBefore(endMoment);
      current.add(1, "day")
    ) {
      if (current.day() === 0) {
        // Domingo
        return current;
      }
    }
    return null;
  }

  /**
   * Formatea fecha para búsqueda en holidays
   */
  private formatDateForHoliday(date: moment.Moment): string {
    // Convertir a formato "D de MMMM" para coincidir con los datos de la tabla holidays
    return date.format("D [de] MMMM").toLowerCase();
  }
}
