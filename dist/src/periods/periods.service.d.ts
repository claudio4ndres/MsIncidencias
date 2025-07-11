import { CalendarRepository } from "@src/_common/repository/calendar.repository";
import { MovementRepository } from "@src/_common/repository/movement.repository";
import "moment/locale/es-mx";
import { PeriodResponseDto } from "./dto/periods.dto";
export declare class PeriodsService {
    private readonly calendarRepository;
    private readonly movementRepository;
    constructor(calendarRepository: CalendarRepository, movementRepository: MovementRepository);
    findAll(): Promise<PeriodResponseDto[]>;
    findMovementsByPeriod(period: string): Promise<{
        periodo: string;
        desde: string;
        hasta: string;
        total: number;
        movimientos: import("../_common/repository").MovementEntity[];
    }>;
}
