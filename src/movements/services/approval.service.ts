import { Injectable, BadRequestException } from '@nestjs/common';
import { ApprovalRepository } from '../../_common/repository/approval.repository';
import { ApprovalEntity, ApprovalStatus, ApprovalType } from '../../_common/repository/entities/approval.entity';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly approvalRepository: ApprovalRepository
  ) {}

  /**
   * Crea una solicitud de aprobación
   */
  async createApproval(
    approvalType: ApprovalType,
    movementId: string,
    requestedBy: string,
    reason: string,
    relatedMovementId?: string
  ): Promise<ApprovalEntity> {
    return await this.approvalRepository.create({
      approvalType,
      movementId,
      relatedMovementId,
      requestedBy,
      reason,
      status: ApprovalStatus.PENDING,
      createdAt: new Date()
    });
  }

  /**
   * Verifica si existe una aprobación aprobada para un día devuelto
   */
  async hasApprovedDiaDevuelto(
    relatedMovementId: string
  ): Promise<boolean> {
    const approval = await this.approvalRepository.findOne({
      where: {
        approvalType: ApprovalType.DIA_DEVUELTO,
        relatedMovementId,
        status: ApprovalStatus.APPROVED
      }
    });

    return !!approval;
  }

  /**
   * Crea o encuentra una solicitud de aprobación para día devuelto
   */
  async createOrFindDiaDevueltoApproval(
    movementId: string,
    requestedBy: string,
    relatedMovementId: string
  ): Promise<ApprovalEntity> {
    // Buscar si ya existe una solicitud pendiente
    const existingApproval = await this.approvalRepository.findPendingApprovalByMovementId(movementId);
    
    if (existingApproval) {
      return existingApproval;
    }

    // Crear nueva solicitud
    const reason = `Solicitud de aprobación para día devuelto de período anterior`;
    
    return await this.approvalRepository.create({
      approvalType: ApprovalType.DIA_DEVUELTO,
      movementId,
      relatedMovementId,
      requestedBy,
      reason,
      status: ApprovalStatus.PENDING,
      approvals: [],
      requiredApprovals: 2,
      createdAt: new Date()
    });
  }

  /**
   * Obtiene todas las aprobaciones pendientes
   */
  async getPendingApprovals(): Promise<ApprovalEntity[]> {
    return await this.approvalRepository.findPendingApprovals();
  }

  /**
   * Aprueba una solicitud
   */
  async approve(
    approvalId: string,
    approvedBy: string,
    comments?: string
  ): Promise<ApprovalEntity> {
    return await this.approvalRepository.approve(approvalId, approvedBy, comments);
  }

  /**
   * Verifica si el usuario ya aprobó una solicitud
   */
  async hasUserApproved(approvalId: string, userId: string): Promise<boolean> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId }
    });
    
    return approval?.hasApprovedBy(userId) || false;
  }

  /**
   * Rechaza una solicitud
   */
  async reject(
    approvalId: string,
    rejectedBy: string,
    comments: string
  ): Promise<ApprovalEntity> {
    return await this.approvalRepository.reject(approvalId, rejectedBy, comments);
  }
}
