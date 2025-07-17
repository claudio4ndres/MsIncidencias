import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TokenGuard } from "@src/_common/guards";
import { Response } from "express";
import { GenerateCVVDto, PeriodResponseDto } from "./dto/periods.dto";
import { PeriodsService } from "./periods.service";

@UseGuards(TokenGuard)
@ApiBearerAuth()
@Controller("periods")
@ApiTags("Periods - Períodos de Nómina")
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  @ApiOperation({
    summary: "Obtener todos los períodos de nómina con información de semana",
  })
  @ApiResponse({
    status: 200,
    description: "Períodos obtenidos exitosamente",
    type: [PeriodResponseDto],
  })
  async findAll(): Promise<PeriodResponseDto[]> {
    return this.periodsService.findAll();
  }

  @Get("filter/:period/movements")
  @ApiOperation({ summary: "Obtener movimientos por período" })
  @ApiParam({
    name: "period",
    description: "Período de nómina",
    example: "2025001",
  })
  @ApiResponse({
    status: 200,
    description: "Movimientos del período obtenidos exitosamente",
  })
  @ApiResponse({ status: 404, description: "Período no encontrado" })
  async getMovementsByPeriod(@Param("period") period: string) {
    return await this.periodsService.findMovementsByPeriod(period);
  }

  @Post("generate/csv")
  @ApiOperation({
    summary: "Generar y descargar archivo CSV para un período específico",
  })
  @ApiBody({ type: GenerateCVVDto })
  @ApiResponse({
    status: 201,
    description: "Archivo CSV generado y descargado exitosamente",
    schema: {
      type: "string",
      format: "binary",
    },
  })
  @ApiResponse({ status: 404, description: "Período no encontrado" })
  @Header("Content-Type", "application/octet-stream")
  async generateCVV(
    @Body() generateCVVDto: GenerateCVVDto,
    @Res() res: Response
  ): Promise<void> {
    console.log("period-controller", generateCVVDto.period);
    const result = await this.periodsService.generateCVV(generateCVVDto.period);

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${result.fileName}"`,
      "Content-Length": result.fileBuffer.length,
    });

    res.send(result.fileBuffer);
  }
}
