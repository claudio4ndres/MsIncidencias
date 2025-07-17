import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { ApprovalEntity, ApprovalStatus, ApprovalType } from './entities/approval.entity';

@Injectable()
export class ApprovalRepository {
  constructor(
    @InjectRepository(ApprovalEntity)
    private readonly approvalRepository: Repository<ApprovalEntity>,
  ) {}

  async create(approvalData: Partial<ApprovalEntity>): Promise<ApprovalEntity> {
    const approval = this.approvalRepository.create(approvalData);
    return await this.approvalRepository.save(approval);
  }

  async findOne(options: FindOneOptions<ApprovalEntity>): Promise<ApprovalEntity | null> {
    return await this.approvalRepository.findOne(options);
  }

  async findAll(options?: FindManyOptions<ApprovalEntity>): Promise<ApprovalEntity[]> {
    return await this.approvalRepository.find(options);
  }

  async findPendingApprovals(): Promise<ApprovalEntity[]> {
    return await this.approvalRepository.find({
      where: { status: ApprovalStatus.PENDING },
      relations: ['requester', 'movement', 'relatedMovement'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByMovementId(movementId: string): Promise<ApprovalEntity | null> {
    return await this.approvalRepository.findOne({
      where: { movementId },
      relations: ['requester', 'movement', 'relatedMovement']
    });
  }

  async findByType(approvalType: ApprovalType): Promise<ApprovalEntity[]> {
    return await this.approvalRepository.find({
      where: { approvalType },
      relations: ['requester', 'movement'],
      order: { createdAt: 'DESC' }
    });
  }

  async approve(approvalId: string, approvedBy: string, comments?: string): Promise<ApprovalEntity> {
    const approval = await this.findOne({ where: { id: approvalId } });
    if (!approval) {
      throw new Error('Approval not found');
    }

    // Verificar que el usuario no haya aprobado ya
    if (approval.hasApprovedBy(approvedBy)) {
      throw new Error('Este usuario ya ha aprobado esta solicitud');
    }

    // Agregar la nueva aprobación
    const currentApprovals = approval.approvals || [];
    const newApproval = {
      approvedBy,
      approvedAt: new Date(),
      comments
    };
    
    const updatedApprovals = [...currentApprovals, newApproval];
    
    // Determinar si se ha completado la aprobación
    const isFullyApproved = updatedApprovals.length >= approval.requiredApprovals;
    
    const updateData: any = {
      approvals: updatedApprovals
    };
    
    if (isFullyApproved) {
      updateData.status = ApprovalStatus.APPROVED;
      updateData.finalApprovedAt = new Date();
    }
    
    await this.approvalRepository.update(approvalId, updateData);
    
    return await this.findOne({ where: { id: approvalId } });
  }

  async reject(approvalId: string, rejectedBy: string, comments: string): Promise<ApprovalEntity> {
    await this.approvalRepository.update(approvalId, {
      status: ApprovalStatus.REJECTED,
      comments,
      finalApprovedAt: new Date()
    });
    
    return await this.findOne({ where: { id: approvalId } });
  }

  async findApprovalForDiaDevuelto(
    employeeCode: number,
    relatedMovementId: string
  ): Promise<ApprovalEntity | null> {
    return await this.approvalRepository.findOne({
      where: {
        approvalType: ApprovalType.DIA_DEVUELTO,
        relatedMovementId,
        status: ApprovalStatus.APPROVED
      },
      relations: ['movement', 'relatedMovement']
    });
  }

  async findPendingApprovalByMovementId(movementId: string): Promise<ApprovalEntity | null> {
    return await this.approvalRepository.findOne({
      where: {
        movementId,
        status: ApprovalStatus.PENDING
      },
      relations: ['requester', 'movement', 'relatedMovement']
    });
  }
}
