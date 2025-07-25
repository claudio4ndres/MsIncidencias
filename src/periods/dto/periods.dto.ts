import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GenerateCVVDto {
  @ApiProperty({
    description: "Período de nómina",
    example: "2025001",
  })
  @IsString()
  @IsNotEmpty()
  period: string;
}

export class GenerateCVVResponseDto {
  @ApiProperty({
    description: "Mensaje de respuesta",
    example: "CVV generado exitosamente",
  })
  message: string;

  @ApiProperty({
    description: "Ruta completa del archivo generado",
    example: "/path/to/temp/CVV-2025001-20250117.csv",
  })
  filePath: string;

  @ApiProperty({
    description: "Nombre del archivo generado",
    example: "CVV-2025001-20250117.csv",
  })
  fileName: string;

  @ApiProperty({
    description: "Período procesado",
    example: "2025001",
  })
  period: string;

  @ApiProperty({
    description: "Total de movimientos incluidos en el CSV",
    example: 150,
  })
  totalMovimientos: number;

  @ApiProperty({
    description: "Rango de fechas procesado",
    example: {
      desde: "2024-12-26",
      hasta: "2025-01-02",
    },
  })
  rangoFechas: {
    desde: string;
    hasta: string;
  };
}

export class CurrentPeriodResponseDto {
  @ApiProperty({
    description: "Period ID (UUID)",
    example: "404177d7-a8b2-467a-8beb-ad3610618cda",
  })
  id: string;

  @ApiProperty({
    description: "Period name/identifier",
    example: "2025031",
  })
  periodName: string;

  @ApiProperty({
    description: "Period start date",
    example: "2025-07-18T04:00:00.000Z",
  })
  periodStart: string;

  @ApiProperty({
    description: "Period end date",
    example: "2025-07-24T04:00:00.000Z",
  })
  periodEnd: string;

  @ApiProperty({
    description: "Period status",
    example: "ACTIVE",
  })
  periodStatus: string;

  @ApiProperty({
    description: "Creation date",
    example: "2025-07-11T18:41:32.139Z",
  })
  createdAt: string;

  @ApiProperty({
    description: "Last update date",
    example: "2025-07-18T15:27:52.524Z",
  })
  updatedAt: string;
}

export class PeriodResponseDto {
  @ApiProperty({
    description: "Calendar ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Month identifier",
    example: "1A. ENE",
  })
  month: string;

  @ApiProperty({
    description: "Period identifier",
    example: "2025001",
  })
  period: string;

  @ApiProperty({
    description: "Date range description",
    example: "jueves 26 diciembre al jueves 2 enero",
  })
  range: string;

  @ApiProperty({
    description: "Incident submission date",
    example: "2025-01-02T00:00:00.000Z",
  })
  incidentSubmission: Date;

  @ApiProperty({
    description: "Process date",
    example: "2025-01-03T00:00:00.000Z",
  })
  process: Date;

  @ApiProperty({
    description: "Policy generation date",
    example: "2025-01-03T00:00:00.000Z",
  })
  policyGeneration: Date;

  @ApiProperty({
    description: "Payment date",
    example: "2025-01-10T00:00:00.000Z",
  })
  payment: Date;

  @ApiProperty({
    description: "ISO week number",
    example: 52,
  })
  semana: number;

  @ApiProperty({
    description: "Total weeks in the year",
    example: 52,
  })
  semanasEnAnio: number;

  @ApiProperty({
    description: "Current period based on today's date (YYYYMMDD format)",
    example: "20250722",
  })
  periodoActual: string;

  @ApiProperty({
    description: "Current ISO week number based on today's date",
    example: 30,
  })
  semanaActual: number;
}

export class PeriodFindAllResponseDto {
  @ApiProperty({
    description: "Period ID (UUID format)",
    example: "404177d7-a8b2-467a-8beb-ad3610618cda",
  })
  id: string;

  @ApiProperty({
    description: "Period name/identifier",
    example: "2025031",
  })
  period_name: string;

  @ApiProperty({
    description: "Period start date in ISO format",
    example: "2025-07-18T04:00:00.000Z",
  })
  period_start: string;

  @ApiProperty({
    description: "Period end date in ISO format",
    example: "2025-07-24T04:00:00.000Z",
  })
  period_end: string;

  @ApiProperty({
    description: "Period status",
    example: "ACTIVE",
  })
  period_status: string;

  @ApiProperty({
    description: "Creation date in ISO format",
    example: "2025-07-11T18:41:32.139Z",
  })
  created_at: string;

  @ApiProperty({
    description: "Last update date in ISO format",
    example: "2025-07-18T15:27:52.524Z",
  })
  updated_at: string;

  @ApiProperty({
    description: "Number of movements associated with this period",
    example: 15,
  })
  movements_count?: number;
}

interface PeriodDto {
  id: string;
  period_name: string;
  period_start: string;
  period_end: string;
  period_status: number;
  created_at: string;
  updated_at: string;
}

export interface FindAllPeriodsResponse {
  periods: PeriodDto[];
}
