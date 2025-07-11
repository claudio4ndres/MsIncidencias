import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Calendar } from "@src/_common/repository/entities/calendar.entity";
import { CalendarService } from "./calendar.service";
import {
  BulkCreateCalendarDto,
  CalendarResponseDto,
  CreateCalendarDto,
  UpdateCalendarDto,
} from "./dto/calendar.dto";

const XLSX = require("xlsx");

@Controller("calendar")
@ApiTags("Calendar - Nóminas")
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: "Obtener todos los calendarios de nómina" })
  @ApiResponse({
    status: 200,
    description: "Calendarios obtenidos exitosamente",
    type: [CalendarResponseDto],
  })
  async findAll(): Promise<Calendar[]> {
    return this.calendarService.findAll();
  }

  @Get("search/period/:period")
  @ApiOperation({ summary: "Buscar calendario por periodo" })
  @ApiParam({
    name: "period",
    description: "Periodo a buscar",
    example: "2025001",
  })
  @ApiResponse({
    status: 200,
    description: "Calendario encontrado",
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 404, description: "Calendario no encontrado" })
  async findByPeriod(@Param("period") period: string): Promise<Calendar> {
    return this.calendarService.findByPeriod(period);
  }

  @Get("search/month/:month")
  @ApiOperation({ summary: "Buscar calendarios por mes" })
  @ApiParam({ name: "month", description: "Mes a buscar", example: "1A. ENE" })
  @ApiResponse({
    status: 200,
    description: "Calendarios encontrados",
    type: [CalendarResponseDto],
  })
  async findByMonth(@Param("month") month: string): Promise<Calendar[]> {
    return this.calendarService.findByMonth(month);
  }

  @Get("search/date-range")
  @ApiOperation({ summary: "Buscar calendarios por rango de fechas" })
  @ApiQuery({
    name: "startDate",
    description: "Fecha de inicio",
    example: "2025-01-01",
  })
  @ApiQuery({
    name: "endDate",
    description: "Fecha de fin",
    example: "2025-12-31",
  })
  @ApiResponse({
    status: 200,
    description: "Calendarios encontrados",
    type: [CalendarResponseDto],
  })
  async findByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ): Promise<Calendar[]> {
    return this.calendarService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener calendario por ID" })
  @ApiParam({ name: "id", description: "ID del calendario", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Calendario encontrado",
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 404, description: "Calendario no encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Calendar> {
    return this.calendarService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear nuevo calendario" })
  @ApiResponse({
    status: 201,
    description: "Calendario creado exitosamente",
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async create(
    @Body() createCalendarDto: CreateCalendarDto
  ): Promise<Calendar> {
    return this.calendarService.create(createCalendarDto);
  }

  @Post("bulk")
  @ApiOperation({ summary: "Crear múltiples calendarios" })
  @ApiResponse({
    status: 201,
    description: "Calendarios creados exitosamente",
    type: [CalendarResponseDto],
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async bulkCreate(
    @Body() bulkCreateDto: BulkCreateCalendarDto
  ): Promise<Calendar[]> {
    return this.calendarService.bulkCreate(bulkCreateDto);
  }

  @Post("import/excel")
  @ApiOperation({ summary: "Importar calendarios desde archivo Excel" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Archivo Excel con datos de calendario",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Calendarios importados exitosamente",
    type: [CalendarResponseDto],
  })
  @ApiResponse({ status: 400, description: "Error en el archivo Excel" })
  @UseInterceptors(FileInterceptor("file"))
  async importFromExcel(
    @UploadedFile() file: Express.Multer.File
  ): Promise<Calendar[]> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException("Only Excel files are allowed");
    }

    try {
      // Leer el archivo Excel
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir a JSON sin header
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Buscar la fila de headers
      let headerRowIndex = -1;
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i] as any[];
        if (row && row.includes("MES") && row.includes("PERIODO")) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new BadRequestException(
          "No se encontraron los headers esperados en el archivo Excel"
        );
      }

      // Obtener headers y datos
      const headers = rawData[headerRowIndex] as string[];
      const dataRows = (rawData as any[][])
        .slice(headerRowIndex + 1)
        .filter((row) => row.length > 0);

      // Convertir a objetos
      const excelData = dataRows
        .map((row) => {
          const obj: any = {};
          headers.forEach((header, i) => {
            if (header && row[i] !== undefined) {
              obj[header] = row[i];
            }
          });
          return obj;
        })
        .filter((obj) => obj.MES && obj.PERIODO); // Filtrar filas válidas

      return this.calendarService.importFromExcel(excelData);
    } catch (error) {
      throw new BadRequestException(
        `Error processing Excel file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar calendario" })
  @ApiParam({ name: "id", description: "ID del calendario", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Calendario actualizado exitosamente",
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 404, description: "Calendario no encontrado" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCalendarDto: UpdateCalendarDto
  ): Promise<Calendar> {
    return this.calendarService.update(id, updateCalendarDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar calendario" })
  @ApiParam({ name: "id", description: "ID del calendario", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Calendario eliminado exitosamente",
  })
  @ApiResponse({ status: 404, description: "Calendario no encontrado" })
  async delete(
    @Param("id", ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    await this.calendarService.delete(id);
    return { message: "Calendar deleted successfully" };
  }

  @Post("validate/rules")
  @ApiOperation({
    summary: "Importar datos desde Excel y convertir a JSON estructurado",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Archivo Excel con datos de incidencias",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Datos del Excel convertidos a JSON exitosamente",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            summary: { type: "object" },
            employees: { type: "array" },
            metadata: { type: "object" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Error en el archivo Excel" })
  @UseInterceptors(FileInterceptor("file"))
  async validateRule(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException("Only Excel files are allowed");
    }

    try {
      // Leer el archivo Excel
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir a JSON sin header
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Buscar la fila de headers
      let headerRowIndex = -1;
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i] as any[];
        if (row && row.length > 0) {
          // Buscar headers típicos de incidencias - necesitamos múltiples headers
          const hasNumEmp = row.some(
            (cell) =>
              cell && typeof cell === "string" && cell.includes("NUM. EMP")
          );
          const hasNombreEmpleado = row.some(
            (cell) =>
              cell &&
              typeof cell === "string" &&
              cell.includes("NOMBRE DEL EMPLEADO")
          );
          const hasTipoEmpl = row.some(
            (cell) =>
              cell && typeof cell === "string" && cell.includes("TIPO EMPL")
          );

          // Buscar la fila que tenga al menos estos 3 headers principales
          if (hasNumEmp && hasNombreEmpleado && hasTipoEmpl) {
            headerRowIndex = i;
            break;
          }
        }
      }

      if (headerRowIndex === -1) {
        throw new BadRequestException(
          "No se encontraron los headers esperados en el archivo Excel"
        );
      }

      // Obtener headers y datos
      const headers = rawData[headerRowIndex] as string[];

      const dataRows = (rawData as any[][])
        .slice(headerRowIndex + 1)
        .filter(
          (row) =>
            row &&
            row.length > 0 &&
            row.some(
              (cell) => cell !== null && cell !== undefined && cell !== ""
            )
        );

      // Convertir a objetos
      const excelData = dataRows
        .map((row) => {
          const obj: any = {};
          headers.forEach((header, i) => {
            if (header && row[i] !== undefined && row[i] !== null) {
              obj[header] = row[i];
            }
          });
          return obj;
        })
        .filter((obj) => Object.keys(obj).length > 0); // Filtrar filas con datos válidos

      // Llamar al servicio para convertir los datos a JSON
      const jsonData = await this.calendarService.validateRules(excelData);

      return {
        success: true,
        message: "Archivo Excel procesado y convertido a JSON exitosamente",
        data: jsonData,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error processing Excel file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
