import { Injectable, NotFoundException } from "@nestjs/common";
import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import { MovementRepository } from "@src/_common/repository/movement.repository";
import * as fs from "fs";
import moment from "moment";
import "moment/locale/es-mx";
import * as path from "path";
import { PeriodResponseDto } from "./dto/periods.dto";

// Configurar moment para usar locale español mexicano
moment.locale("es-mx");

@Injectable()
export class PeriodsService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly movementRepository: MovementRepository
  ) {}

  async findCurrent(): Promise<any | null> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    // Buscar período activo donde la fecha actual esté dentro del rango de fechas
    const calendar = await this.calendarRepository.findCurrentPeriod(
      startOfDay,
      endOfDay
    );

    if (!calendar) {
      return null;
    }

    // Transformar datos de Calendar al formato Period
    return this.transformCalendarToPeriod(calendar, now);
  }

  private transformCalendarToPeriod(
    calendar: Calendar,
    currentDate: Date
  ): any {
    // Parsear el rango para obtener las fechas de inicio y fin
    const { periodStart, periodEnd } = this.parsePeriodRange(
      calendar.range,
      calendar.incidentSubmission.getFullYear()
    );

    return {
      id: calendar.id,
      period_name: calendar.period,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      period_status: "ACTIVE",
      created_at: calendar.incidentSubmission.toISOString(),
      updated_at: currentDate.toISOString(),
    };
  }

  private parsePeriodRange(
    rangeString: string,
    year: number
  ): { periodStart: Date; periodEnd: Date } {
    try {
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

      // Caso 1: "al miércoles 25 diciembre" - Solo fecha final
      const singleDateMatch = rangeString.match(
        /^al\s+(\w+)\s+(\d{1,2})\s+(\w+)$/i
      );
      if (singleDateMatch) {
        const [, , endDay, endMonth] = singleDateMatch;
        const endMonthNum = monthMap[endMonth.toLowerCase()];

        if (endMonthNum === undefined) {
          throw new Error(`Mes no reconocido: ${endMonth}`);
        }

        // Para casos como "al 25 diciembre", asumimos que empieza el 1 del mismo mes
        const periodStart = new Date(year, endMonthNum, 1, 4, 0, 0);
        const periodEnd = new Date(
          year,
          endMonthNum,
          parseInt(endDay),
          4,
          0,
          0
        );

        return { periodStart, periodEnd };
      }

      // Caso 2: "viernes 6 al jueves 12 junio" - Sin mes en la primera fecha
      const partialMatch = rangeString.match(
        /(\w+)\s+(\d{1,2})\s+al\s+(\w+)\s+(\d{1,2})\s+(\w+)/i
      );
      if (partialMatch) {
        const [, , startDay, , endDay, endMonth] = partialMatch;
        const endMonthNum = monthMap[endMonth.toLowerCase()];

        if (endMonthNum === undefined) {
          throw new Error(`Mes no reconocido: ${endMonth}`);
        }

        // La fecha de inicio usa el mismo mes que la fecha final
        const periodStart = new Date(
          year,
          endMonthNum,
          parseInt(startDay),
          4,
          0,
          0
        );
        const periodEnd = new Date(
          year,
          endMonthNum,
          parseInt(endDay),
          4,
          0,
          0
        );

        return { periodStart, periodEnd };
      }

      // Caso 3: "jueves 26 diciembre al jueves 2 enero" - Formato completo
      const fullMatch = rangeString.match(
        /(\w+)\s+(\d{1,2})\s+(\w+)\s+al?\s+(\w+)\s+(\d{1,2})\s+(\w+)/i
      );
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

        const periodStart = new Date(
          startYear,
          startMonthNum,
          parseInt(startDay),
          4,
          0,
          0
        );
        const periodEnd = new Date(
          endYear,
          endMonthNum,
          parseInt(endDay),
          4,
          0,
          0
        );

        return { periodStart, periodEnd };
      }

      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return { periodStart: start, periodEnd: end };
    } catch (error) {
      console.error(`Error parsing range '${rangeString}':`, error);
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      return { periodStart: start, periodEnd: end };
    }
  }

  async findAll(): Promise<PeriodResponseDto[]> {
    const periods = await this.calendarRepository.findAll();

    const updatedPeriods = periods.map((calendar) => {
      let initialDate: moment.Moment;
      const submissionYear = calendar.incidentSubmission.getFullYear();

      try {
        // Extraer la fecha inicial del rango dependiendo del formato
        // Diversos formatos posibles:
        // "jueves 26 diciembre al jueves 2 enero"
        // "viernes 6 al jueves 12 junio"
        // "viernes 1 agosto a jueves 7 agosto"
        // "al miércoles 25 diciembre"

        if (calendar.range.includes(" al ") || calendar.range.includes(" a ")) {
          // Intentar formato completo con mes: "jueves 26 diciembre al/a..."
          let firstDateMatch = calendar.range.match(
            /(\w+) (\d{1,2}) (\w+) a(?:l)?/
          );
          if (firstDateMatch) {
            const [, , day, month] = firstDateMatch;
            initialDate = moment(
              `${day} ${month} ${submissionYear}`,
              "D MMMM YYYY"
            );
          } else {
            // Formato sin mes en la primera fecha: "viernes 6 al/a jueves 12 junio"
            const partialMatch = calendar.range.match(
              /(\w+) (\d{1,2}) a(?:l)? \w+ \d{1,2} (\w+)/
            );
            if (partialMatch) {
              const [, , day, month] = partialMatch;
              initialDate = moment(
                `${day} ${month} ${submissionYear}`,
                "D MMMM YYYY"
              );
            } else {
              // Si no coincide, usar la fecha de incidentSubmission
              initialDate = moment(calendar.incidentSubmission);
            }
          }
        } else if (calendar.range.includes("al ")) {
          // Formato: "al miércoles 25 diciembre"
          const dateMatch = calendar.range.match(/al \w+ (\d{1,2}) (\w+)/);
          if (dateMatch) {
            const [, day, month] = dateMatch;
            initialDate = moment(
              `${day} ${month} ${submissionYear}`,
              "D MMMM YYYY"
            );
          } else {
            initialDate = moment(calendar.incidentSubmission);
          }
        } else {
          // Fallback: usar la fecha de incidentSubmission
          initialDate = moment(calendar.incidentSubmission);
        }

        // Ajuste lógico para casos diciembre-enero
        // Si la fecha es en enero pero el rango menciona diciembre,
        // asumimos que es del año anterior
        if (initialDate.month() === 0 && calendar.range.includes("diciembre")) {
          initialDate.subtract(1, "year");
        }
        // Si la fecha es en diciembre pero el incidentSubmission es del año siguiente,
        // mantenemos el año de la fecha parseada
        if (
          initialDate.month() === 11 &&
          moment(calendar.incidentSubmission).month() === 0
        ) {
          initialDate.year(submissionYear - 1);
        }

        // Calcular la semana ISO
        const semana = initialDate.isValid() ? initialDate.isoWeek() : 1;

        // Calcular las semanas en el año del submission
        const semanasEnAnio = moment(
          calendar.incidentSubmission
        ).isoWeeksInYear();

        return {
          //id: calendar.id,
          //month: calendar.month,
          period: calendar.period,
          //range: calendar.range,
          //incidentSubmission: calendar.incidentSubmission,
          //process: calendar.process,
          //policyGeneration: calendar.policyGeneration,
          //payment: calendar.payment,
          semana,
          semanasEnAnio,
          periodoActual: moment().format("YYYYMMDD"),
          semanaActual: moment().isoWeek(),
        } as PeriodResponseDto;
      } catch (error) {
        console.error(
          `Error parsing range for calendar ${calendar.id}: ${calendar.range}`,
          error
        );
        // En caso de error, devolver datos básicos con semana por defecto
        return {
          id: calendar.id,
          month: calendar.month,
          period: calendar.period,
          range: calendar.range,
          incidentSubmission: calendar.incidentSubmission,
          process: calendar.process,
          policyGeneration: calendar.policyGeneration,
          payment: calendar.payment,
          semana: 1,
          semanasEnAnio: 52,
          periodoActual: moment().format("YYYYMMDD"),
          semanaActual: moment().isoWeek(),
        } as PeriodResponseDto;
      }
    });

    return updatedPeriods;
  }

  async findMovementsByPeriod(period: string) {
    const calendar = await this.calendarRepository.findByPeriod(period);
    if (!calendar) {
      throw new NotFoundException(`No se encontró el periodo: ${period}`);
    }

    const range = calendar.range;

    // Extraer fechas del range (e.g. "jueves 26 diciembre al jueves 2 enero")
    const fechas = range.match(/(\d{1,2})\s+([a-zA-Záéíóú]+)/g);
    if (!fechas || fechas.length === 0)
      throw new NotFoundException(`Range inválido: ${range}`);

    const refYear = calendar.incidentSubmission.getFullYear();
    const startDate = moment(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);
    const endDate =
      fechas.length > 1
        ? moment(`${fechas[1]}`, "D MMMM", "es-mx").year(refYear)
        : moment(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);

    // Ajustar años si hay cruce entre diciembre y enero
    if (endDate.isBefore(startDate)) {
      endDate.add(1, "year");
    }

    // Buscar movimientos
    const movimientos = await this.movementRepository.findByDateRange(
      startDate.toDate(),
      endDate.toDate()
    );

    return {
      periodo: period,
      desde: startDate.format("YYYY-MM-DD"),
      hasta: endDate.format("YYYY-MM-DD"),
      total: movimientos.length,
      movimientos,
    };
  }

  async generateCVV(period: string) {
    console.log("period", period);
    const calendar = await this.calendarRepository.findByPeriod(period);
    if (!calendar) {
      throw new NotFoundException(`No se encontró el periodo: ${period}`);
    }
    console.log("calendar", calendar);
    // Obtener el rango de fechas del calendario
    const range = calendar.range;
    console.log("Range original:", range);

    // Extraer fechas del range usando la misma lógica que findMovementsByPeriod
    const fechas = range.match(/(\d{1,2})\s+([a-zA-Záéíóú]+)/g);
    if (!fechas || fechas.length === 0)
      throw new NotFoundException(`Range inválido: ${range}`);

    console.log("Fechas extraídas:", fechas);

    const refYear = calendar.incidentSubmission.getFullYear();
    const startDate = moment(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);
    const endDate =
      fechas.length > 1
        ? moment(`${fechas[1]}`, "D MMMM", "es-mx").year(refYear)
        : moment(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);

    console.log("Fechas parseadas:");
    console.log("StartDate:", startDate.format("YYYY-MM-DD"));
    console.log("EndDate before adjustment:", endDate.format("YYYY-MM-DD"));

    // Ajustar años si hay cruce entre diciembre y enero
    if (endDate.isBefore(startDate)) {
      endDate.add(1, "year");
      console.log(
        "EndDate after year adjustment:",
        endDate.format("YYYY-MM-DD")
      );
    }

    // Buscar movimientos
    console.log(
      "Buscando movimientos entre:",
      startDate.format("YYYY-MM-DD"),
      "y",
      endDate.format("YYYY-MM-DD")
    );
    const movimientos = await this.movementRepository.findByDateRangeForCSV(
      startDate.toDate(),
      endDate.toDate()
    );

    console.log("Total movimientos encontrados:", movimientos.length);
    console.log(
      "Movimientos:",
      movimientos.map((m) => ({
        id: m.id,
        employeeCode: m.employeeCode,
        incidentCode: m.incidentCode,
        incidenceDate: m.incidenceDate,
      }))
    );

    // Mapa de códigos de incidencia según los requerimientos
    const incidenciaMap = {
      "005": "005", // Descansos Trabajados (Columna I)
      "008": "008", // Prima dominical (Columna K)
      "215": "251", // Faltas (Columna Q) - código 215 se mapea a 251
      "251": "251", // Faltas (Columna Q) - por si acaso también existe 251
      "009": "009", // Días devueltos (Columna O)
    };

    // Filtrar solo los movimientos que corresponden a los códigos de incidencia requeridos
    const movimientosFiltrados = movimientos.filter((movimiento) =>
      incidenciaMap.hasOwnProperty(movimiento.incidentCode)
    );

    console.log("Movimientos filtrados:", movimientosFiltrados.length);
    console.log(
      "Códigos de incidencia en movimientos filtrados:",
      movimientosFiltrados.map((m) => m.incidentCode)
    );

    // Preparar datos CSV
    const csvRows = movimientosFiltrados.map((movimiento) => {
      const incidenciaId = incidenciaMap[movimiento.incidentCode];
      return [
        movimiento.employee.employeeCode,
        incidenciaId,
        "1", // Número de incidencias (constante 1)
        "0", // Importe (constante 0)
      ].join("|");
    });

    // Escribir a archivo CSV
    const csvContent = csvRows.join("\n");
    const fileName = `CSV-${period}-${moment().format("YYYYMMDD")}.csv`;
    const filePath = path.join(process.cwd(), "temp", fileName);

    try {
      // Crear directorio temp si no existe
      const tempDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(filePath, csvContent, "utf8");
      const fileBuffer = fs.readFileSync(filePath);

      return {
        message: "CSV generado exitosamente",
        filePath,
        fileName,
        period,
        totalMovimientos: movimientosFiltrados.length,
        rangoFechas: {
          desde: startDate.format("YYYY-MM-DD"),
          hasta: endDate.format("YYYY-MM-DD"),
        },
        fileBuffer,
      };
    } catch (error) {
      throw new NotFoundException(
        `Error al generar archivo CVV: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
