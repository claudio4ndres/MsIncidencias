import { PeriodsService } from './periods.service';
import { PeriodResponseDto } from './dto/periods.dto';
export declare class PeriodsController {
    private readonly periodsService;
    constructor(periodsService: PeriodsService);
    findAll(): Promise<PeriodResponseDto[]>;
    getMovementsByPeriod(period: string): Promise<{
        periodo: string;
        desde: string;
        hasta: string;
        total: number;
        movimientos: import("../_common/repository").MovementEntity[];
    }>;
}
