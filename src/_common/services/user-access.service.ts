import { Injectable } from "@nestjs/common";
import { In } from "typeorm";
import { UserSessionDto } from "../../auth/dto/auth-response.dto";
import { UserAccessRepository } from "../repository/user-access.repository";

@Injectable()
export class UserAccessService {
  constructor(private readonly userAccessRepository: UserAccessRepository) {}

  /**
   * Obtiene las compañías accesibles para un usuario
   */
  async getAccessibleCompanies(userId: string): Promise<string[]> {
    return await this.userAccessRepository.getAccessibleCompanies(userId);
  }

  /**
   * Obtiene las oficinas accesibles para un usuario
   */
  async getAccessibleOffices(userId: string): Promise<string[]> {
    return await this.userAccessRepository.getAccessibleOffices(userId);
  }

  /**
   * Verifica si un usuario tiene acceso a una compañía específica
   */
  async hasAccessToCompany(
    userId: string,
    companyId: string
  ): Promise<boolean> {
    return await this.userAccessRepository.hasAccessToCompany(
      userId,
      companyId
    );
  }

  /**
   * Verifica si un usuario tiene acceso a una oficina específica
   */
  async hasAccessToOffice(userId: string, officeId: string): Promise<boolean> {
    return await this.userAccessRepository.hasAccessToOffice(userId, officeId);
  }

  /**
   * Construye condiciones de filtrado para queries basadas en el acceso del usuario
   */
  async buildOfficeFilter(token: UserSessionDto): Promise<any> {
    const accessibleOffices = await this.getAccessibleOffices(token.id);
    console.log("Offices accessible for user:", accessibleOffices);
    // Si no hay acceso definido en la tabla, el usuario no tiene acceso a ninguna oficina
    if (accessibleOffices.length === 0) {
      throw new Error("El usuario no tiene acceso a ninguna oficina");
    }

    // Si tiene acceso a una sola oficina, filtrar por esa
    if (accessibleOffices.length === 1) {
      return { id: accessibleOffices[0] };
    }

    // Si tiene acceso a múltiples oficinas, usar operador IN
    return { id: In(accessibleOffices) };
  }

  /**
   * Construye condiciones de filtrado para queries basadas en compañías accesibles
   */
  async buildCompanyFilter(token: UserSessionDto): Promise<any> {
    const accessibleCompanies = await this.getAccessibleCompanies(token.id);

    // Si no hay acceso definido en la tabla, el usuario no tiene acceso a ninguna compañía
    if (accessibleCompanies.length === 0) {
      throw new Error("El usuario no tiene acceso a ninguna compañía");
    }

    // Si tiene acceso a una sola compañía, filtrar por esa
    if (accessibleCompanies.length === 1) {
      return { id: accessibleCompanies[0] };
    }

    // Si tiene acceso a múltiples compañías, usar operador IN
    return { id: In(accessibleCompanies) };
  }

  /**
   * Valida si un usuario puede acceder a los recursos solicitados
   */
  async validateAccess(
    token: UserSessionDto,
    companyId?: string,
    officeId?: string
  ): Promise<boolean> {
    if (companyId && !(await this.hasAccessToCompany(token.id, companyId))) {
      return false;
    }

    if (officeId && !(await this.hasAccessToOffice(token.id, officeId))) {
      return false;
    }

    return true;
  }
}
