import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarDto {
  @ApiProperty({ 
    description: 'Month identifier (e.g., "1A. ENE", "2A. FEB")',
    example: '1A. ENE' 
  })
  @IsString()
  month: string;

  @ApiProperty({ 
    description: 'Period identifier',
    example: '2025001' 
  })
  @IsString()
  period: string;

  @ApiProperty({ 
    description: 'Date range description',
    example: 'jueves 26 diciembre al jueves 2 enero' 
  })
  @IsString()
  range: string;

  @ApiProperty({ 
    description: 'Incident submission date',
    example: '2025-01-02T00:00:00.000Z' 
  })
  @IsDateString()
  incidentSubmission: string;

  @ApiProperty({ 
    description: 'Process date',
    example: '2025-01-03T00:00:00.000Z' 
  })
  @IsDateString()
  process: string;

  @ApiProperty({ 
    description: 'Policy generation date',
    example: '2025-01-03T00:00:00.000Z' 
  })
  @IsDateString()
  policyGeneration: string;

  @ApiProperty({ 
    description: 'Payment date',
    example: '2025-01-10T00:00:00.000Z' 
  })
  @IsDateString()
  payment: string;
}

export class UpdateCalendarDto {
  @ApiProperty({ 
    description: 'Month identifier (e.g., "1A. ENE", "2A. FEB")',
    example: '1A. ENE',
    required: false 
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiProperty({ 
    description: 'Period identifier',
    example: '2025001',
    required: false 
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({ 
    description: 'Date range description',
    example: 'jueves 26 diciembre al jueves 2 enero',
    required: false 
  })
  @IsOptional()
  @IsString()
  range?: string;

  @ApiProperty({ 
    description: 'Incident submission date',
    example: '2025-01-02T00:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  incidentSubmission?: string;

  @ApiProperty({ 
    description: 'Process date',
    example: '2025-01-03T00:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  process?: string;

  @ApiProperty({ 
    description: 'Policy generation date',
    example: '2025-01-03T00:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  policyGeneration?: string;

  @ApiProperty({ 
    description: 'Payment date',
    example: '2025-01-10T00:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  payment?: string;
}

export class CalendarResponseDto {
  @ApiProperty({ description: 'Calendar ID' })
  id: number;

  @ApiProperty({ description: 'Month identifier' })
  month: string;

  @ApiProperty({ description: 'Period identifier' })
  period: string;

  @ApiProperty({ description: 'Date range description' })
  range: string;

  @ApiProperty({ description: 'Incident submission date' })
  incidentSubmission: Date;

  @ApiProperty({ description: 'Process date' })
  process: Date;

  @ApiProperty({ description: 'Policy generation date' })
  policyGeneration: Date;

  @ApiProperty({ description: 'Payment date' })
  payment: Date;
}

export class BulkCreateCalendarDto {
  @ApiProperty({ 
    description: 'Array of calendar entries to create',
    type: [CreateCalendarDto] 
  })
  calendars: CreateCalendarDto[];
}
