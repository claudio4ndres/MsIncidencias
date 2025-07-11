import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PeriodsService } from './periods.service';
import { PeriodResponseDto } from './dto/periods.dto';

@Controller('periods')
@ApiTags('Periods - Períodos de Nómina')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los períodos de nómina con información de semana' })
  @ApiResponse({
    status: 200,
    description: 'Períodos obtenidos exitosamente',
    type: [PeriodResponseDto],
  })
  async findAll(): Promise<PeriodResponseDto[]> {
    return this.periodsService.findAll();
  }

  @Get('filter/:period/movements')
  @ApiOperation({ summary: 'Obtener movimientos por período' })
  @ApiResponse({
    status: 200,
    description: 'Movimientos del período obtenidos exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Período no encontrado' })
  async getMovementsByPeriod(@Param('period') period: string) {
    return await this.periodsService.findMovementsByPeriod(period);
  }
}
