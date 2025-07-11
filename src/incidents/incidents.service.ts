import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from "../_common/dto/pagination.dto";
import { IncidentRepository } from "../_common/repository";
import { IncidentEntity } from "../_common/repository/entities/incident.entity";
import {
  CreateIncidentDto,
  IncidentResponseDto,
  UpdateIncidentDto,
} from "./dto/incident.dto";
@Injectable()
export class IncidentsService {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<IncidentResponseDto>> {
    const { page = 1, pageSize = 10, search = "" } = paginationQuery;
    const skip = (page - 1) * pageSize;

    try {
      const whereCondition = search
        ? [
            { incidentName: Like(`%${search}%`) },
            { incidentCode: Like(`%${search}%`) },
          ]
        : {};

      const [incidents, total] = await Promise.all([
        this.incidentRepository.find({
          where: whereCondition,
          skip,
          take: pageSize,
          order: { createdAt: "DESC" },
        }),
        this.incidentRepository.count({ where: whereCondition }),
      ]);

      const incidentsDto = incidents.map((incident) =>
        this.mapToResponseDto(incident)
      );
      return new PaginatedResponseDto(incidentsDto, total, page, pageSize);
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los incidentes");
    }
  }

  async findOne(id: string): Promise<IncidentResponseDto> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException("Incidente no encontrado");
    }

    return this.mapToResponseDto(incident);
  }

  async create(
    createIncidentDto: CreateIncidentDto
  ): Promise<IncidentResponseDto> {
    try {
      // Verificar que no exista un incidente con el mismo código
      const existingIncident = await this.incidentRepository.findOne({
        where: { incidentCode: createIncidentDto.incident_code },
      });

      if (existingIncident) {
        throw new ConflictException("Ya existe un incidente con este código");
      }

      const savedIncident = await this.incidentRepository.save({
        id: uuidv4(),
        incidentCode: createIncidentDto.incident_code,
        incidentName: createIncidentDto.incident_name,
        incidentStatus: createIncidentDto.incident_status,
        updatedAt: new Date(),
      });

      return this.mapToResponseDto(savedIncident);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error al crear el incidente");
    }
  }

  async update(
    updateIncidentDto: UpdateIncidentDto
  ): Promise<IncidentResponseDto> {
    const { id, ...updateData } = updateIncidentDto;

    // Verificar que el incidente existe
    await this.findOne(id);

    try {
      // Si se actualiza el código, verificar que no exista otro incidente con el mismo código
      if (updateData.incident_code) {
        const existingIncident = await this.incidentRepository.findOne({
          where: { incidentCode: updateData.incident_code },
        });

        if (existingIncident && existingIncident.id !== id) {
          throw new ConflictException("Ya existe un incidente con este código");
        }
      }

      await this.incidentRepository.update(
        { id },
        {
          incidentCode: updateData.incident_code,
          incidentName: updateData.incident_name,
          incidentStatus: updateData.incident_status,
        }
      );

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al actualizar el incidente"
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    // Verificar que el incidente existe
    await this.findOne(id);

    try {
      await this.incidentRepository.delete({ id });
      return { message: "Incidente eliminado correctamente" };
    } catch (error) {
      // Verificar si hay movimientos asociados
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ER_ROW_IS_REFERENCED_2"
      ) {
        throw new ConflictException(
          "No se puede eliminar el incidente porque tiene movimientos asociados"
        );
      }
      throw new InternalServerErrorException("Error al eliminar el incidente");
    }
  }

  async findByStatus(status: number): Promise<IncidentResponseDto[]> {
    try {
      const incidents = await this.incidentRepository.find({
        where: { incidentStatus: status },
        order: { createdAt: "DESC" },
      });
      return incidents.map((incident) => this.mapToResponseDto(incident));
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener incidentes por estado"
      );
    }
  }

  async findByCode(code: string): Promise<IncidentResponseDto> {
    const incident = await this.incidentRepository.findOne({
      where: { incidentCode: code },
    });

    if (!incident) {
      throw new NotFoundException("Incidente no encontrado");
    }

    return this.mapToResponseDto(incident);
  }

  async findWithMovements(id: string): Promise<IncidentResponseDto> {
    try {
      const incident = await this.incidentRepository.findOne({
        where: { id },
        relations: ["movements", "movements.employee"],
      });

      if (!incident) {
        throw new NotFoundException("Incidente no encontrado");
      }

      return this.mapToResponseDto(incident);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al obtener el incidente con movimientos"
      );
    }
  }

  async getStats(): Promise<any> {
    try {
      const [total, active, inactive] = await Promise.all([
        this.incidentRepository.count(),
        this.incidentRepository.count({ where: { incidentStatus: 1 } }),
        this.incidentRepository.count({ where: { incidentStatus: 0 } }),
      ]);

      return {
        total,
        active,
        inactive,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al obtener estadísticas de incidentes"
      );
    }
  }

  private mapToResponseDto(incident: IncidentEntity): IncidentResponseDto {
    return {
      id: incident.id,
      incident_code: incident.incidentCode,
      incident_name: incident.incidentName,
      incident_status: incident.incidentStatus,
      created_at: incident.createdAt,
      updated_at: incident.updatedAt,
    };
  }
}
