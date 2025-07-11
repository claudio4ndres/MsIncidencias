import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TokenGuard } from "@src/_common/guards";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import {
  CreateOfficeDto,
  DeleteOfficeDto,
  OfficeResponseDto,
  UpdateOfficeDto,
} from "./dto/office.dto";
import { OfficesService } from "./offices.service";

@ApiTags("Oficinas")
@Controller("offices")
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  @ApiOperation({ summary: "Obtener lista de oficinas" })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<OfficeResponseDto>> {
    return this.officesService.findAll(paginationQuery);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una oficina por ID" })
  async findOne(@Param("id") id: string): Promise<OfficeResponseDto> {
    return this.officesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear una nueva oficina" })
  async create(
    @Body() createOfficeDto: CreateOfficeDto
  ): Promise<OfficeResponseDto> {
    return this.officesService.create(createOfficeDto);
  }

  @Put()
  @ApiOperation({ summary: "Actualizar una oficina" })
  async update(
    @Body() updateOfficeDto: UpdateOfficeDto
  ): Promise<OfficeResponseDto> {
    return this.officesService.update(updateOfficeDto);
  }

  @Delete()
  @ApiOperation({ summary: "Eliminar una oficina" })
  async remove(
    @Body() deleteOfficeDto: DeleteOfficeDto
  ): Promise<{ message: string }> {
    return this.officesService.remove(deleteOfficeDto.id);
  }
}
