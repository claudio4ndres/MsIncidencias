import { ApiProperty } from '@nestjs/swagger';

export class PeriodResponseDto {
  @ApiProperty({ 
    description: 'Calendar ID',
    example: 1 
  })
  id: number;

  @ApiProperty({ 
    description: 'Month identifier',
    example: '1A. ENE' 
  })
  month: string;

  @ApiProperty({ 
    description: 'Period identifier',
    example: '2025001' 
  })
  period: string;

  @ApiProperty({ 
    description: 'Date range description',
    example: 'jueves 26 diciembre al jueves 2 enero' 
  })
  range: string;

  @ApiProperty({ 
    description: 'Incident submission date',
    example: '2025-01-02T00:00:00.000Z' 
  })
  incidentSubmission: Date;

  @ApiProperty({ 
    description: 'Process date',
    example: '2025-01-03T00:00:00.000Z' 
  })
  process: Date;

  @ApiProperty({ 
    description: 'Policy generation date',
    example: '2025-01-03T00:00:00.000Z' 
  })
  policyGeneration: Date;

  @ApiProperty({ 
    description: 'Payment date',
    example: '2025-01-10T00:00:00.000Z' 
  })
  payment: Date;

  @ApiProperty({ 
    description: 'ISO week number',
    example: 52 
  })
  semana: number;

  @ApiProperty({ 
    description: 'Total weeks in the year',
    example: 52 
  })
  semanasEnAnio: number;
}
