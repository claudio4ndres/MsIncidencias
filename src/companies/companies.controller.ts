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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/_common/decorators";
import { Role } from "@src/_common/enums";
import { TokenGuard } from "@src/_common/guards";
import { RolesGuard } from "@src/_common/guards/roles.guard";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { CompaniesService } from "./companies.service";
import {
  CompanyResponseDto,
  CreateCompanyDto,
  DeleteCompanyDto,
  UpdateCompanyDto,
} from "./dto/company.dto";

@ApiTags("Compañías")
@Controller("companies")
@UseGuards(TokenGuard, RolesGuard)
@Roles(Role.ADMIN, Role.GERENTE)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Get()
  @ApiOperation({
    summary: "Obtener lista de compañías con paginación y búsqueda",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de compañías obtenida exitosamente",
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<CompanyResponseDto>> {
    return this.companiesService.findAll(paginationQuery);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una compañía por ID" })
  @ApiResponse({
    status: 200,
    description: "Compañía encontrada",
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 404, description: "Compañía no encontrada" })
  async findOne(@Param("id") id: string): Promise<CompanyResponseDto> {
    return this.companiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear una nueva compañía" })
  @ApiResponse({
    status: 201,
    description: "Compañía creada exitosamente",
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  async create(
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<CompanyResponseDto> {
    return this.companiesService.create(createCompanyDto);
  }

  @Put()
  @ApiOperation({ summary: "Actualizar una compañía" })
  @ApiResponse({
    status: 200,
    description: "Compañía actualizada exitosamente",
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 404, description: "Compañía no encontrada" })
  async update(
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyResponseDto> {
    return this.companiesService.update(updateCompanyDto);
  }

  @Delete()
  @ApiOperation({ summary: "Eliminar una compañía" })
  @ApiResponse({ status: 200, description: "Compañía eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Compañía no encontrada" })
  async remove(
    @Body() deleteCompanyDto: DeleteCompanyDto
  ): Promise<{ message: string }> {
    return this.companiesService.remove(deleteCompanyDto.id);
  }
  /*
  @Get("status/:status")
  @ApiOperation({ summary: "Obtener compañías por estado" })
  @ApiResponse({ status: 200, description: "Compañías obtenidas por estado" })
  async findByStatus(
    @Param("status") status: string
  ): Promise<CompanyResponseDto[]> {
    return this.companiesService.findByStatus(parseInt(status));
  }

  @Get(":id/offices")
  @ApiOperation({ summary: "Obtener compañía con sus oficinas" })
  @ApiResponse({ status: 200, description: "Compañía con oficinas obtenida" })
  async findWithOffices(@Param("id") id: string): Promise<CompanyResponseDto> {
    return this.companiesService.findWithOffices(id);
  }

  @Get(":id/users")
  @ApiOperation({ summary: "Obtener compañía con sus usuarios" })
  @ApiResponse({ status: 200, description: "Compañía con usuarios obtenida" })
  async findWithUsers(@Param("id") id: string): Promise<CompanyResponseDto> {
    return this.companiesService.findWithUsers(id);
  }
*/
}
