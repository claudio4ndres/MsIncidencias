import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAccessEntity } from "./entities/user-access.entity";

@Injectable()
export class UserAccessRepository {
  constructor(
    @InjectRepository(UserAccessEntity)
    private readonly repository: Repository<UserAccessEntity>
  ) {}

  async findByUserId(userId: string): Promise<UserAccessEntity[]> {
    return await this.repository.find({
      where: { userId, status: 1 },
      relations: ["company", "office"],
    });
  }

  async findByUserIdAndCompany(
    userId: string,
    companyId: string
  ): Promise<UserAccessEntity[]> {
    return await this.repository.find({
      where: { userId, companyId, status: 1 },
      relations: ["company", "office"],
    });
  }

  async findByUserIdAndOffice(
    userId: string,
    officeId: string
  ): Promise<UserAccessEntity | null> {
    return await this.repository.findOne({
      where: { userId, officeId, status: 1 },
      relations: ["company", "office"],
    });
  }

  async hasAccessToCompany(
    userId: string,
    companyId: string
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: { userId, companyId, status: 1 },
    });
    return count > 0;
  }

  async hasAccessToOffice(userId: string, officeId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { userId, officeId, status: 1 },
    });
    return count > 0;
  }

  async getAccessibleCompanies(userId: string): Promise<string[]> {
    const accesses = await this.repository.find({
      where: { userId, status: 1 },
      select: ["companyId"],
    });
    console.log("Accessible companies for user:", accesses);
    return [...new Set(accesses.map((access) => access.companyId))];
  }

  async getAccessibleOffices(userId: string): Promise<string[]> {
    const accesses = await this.repository.find({
      where: { userId, status: 1 },
      select: ['officeId']
    });
    return [...new Set(accesses.map(access => access.officeId))];
  }

  async save(userAccess: Partial<UserAccessEntity>): Promise<UserAccessEntity> {
    return await this.repository.save(userAccess);
  }
}
