import { Injectable, NotFoundException } from "@nestjs/common";
import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { MovementRepository } from "@src/_common/repository/movement.repository";
import moment from "moment";
import "moment/locale/es-mx";
import { PeriodResponseDto } from "./dto/periods.dto";

// Configurar moment para usar locale español mexicano
moment.locale("es-mx");

@Injectable()
export class PeriodsService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly movementRepository: MovementRepository
  ) {}

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
}
