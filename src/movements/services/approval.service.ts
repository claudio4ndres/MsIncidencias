import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApprovalRepository } from '../../_common/repository/approval.repository';
import { MovementRepository } from '../../_common/repository/movement.repository';
import { ApprovalEntity, ApprovalStatus, ApprovalType } from '../../_common/repository/entities/approval.entity';
import { MovementEntity, MovementApprovalStatus } from '../../_common/repository/entities/movement.entity';
import { UserSessionDto } from '../../auth/dto/auth-response.dto';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly approvalRepository: ApprovalRepository,
    private readonly movementRepository: MovementRepository
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

  // =====================================================
  // FUNCIONES PARA FLUJO SECUENCIAL DE APROBACIÓN
  // =====================================================

  /**
   * Aprueba un movimiento por el Gerente de Zona
   */
  async approveByZoneManager(
    movementId: string,
    approvedBy: string,
    comments?: string,
    userSession?: UserSessionDto
  ): Promise<MovementEntity> {
    const movement = await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });

    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    if (movement.approvalStatus !== MovementApprovalStatus.PENDING) {
      throw new BadRequestException('El movimiento no está en estado pendiente');
    }

    // TODO: Verificar que el usuario tiene rol de Gerente de Zona
    // if (!this.isZoneManager(userSession)) {
    //   throw new ForbiddenException('Solo el Gerente de Zona puede realizar esta aprobación');
    // }

    // Actualizar el estado del movimiento
    await this.movementRepository.update({ id: movementId }, {
      approvalStatus: MovementApprovalStatus.APPROVED_BY_ZONE_MANAGER,
      updatedAt: new Date()
    });

    console.log(`Movimiento ${movementId} aprobado por Gerente de Zona: ${approvedBy}`);

    return await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });
  }

  /**
   * Aprueba un movimiento por el Administrador de Personal
   */
  async approveByHRAdmin(
    movementId: string,
    approvedBy: string,
    comments?: string,
    userSession?: UserSessionDto
  ): Promise<MovementEntity> {
    const movement = await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });

    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    if (movement.approvalStatus !== MovementApprovalStatus.APPROVED_BY_ZONE_MANAGER) {
      throw new BadRequestException('El movimiento debe ser aprobado primero por el Gerente de Zona');
    }

    // TODO: Verificar que el usuario tiene rol de Administrador de Personal
    // if (!this.isHRAdmin(userSession)) {
    //   throw new ForbiddenException('Solo el Administrador de Personal puede realizar esta aprobación');
    // }

    // Actualizar el estado del movimiento a completamente aprobado
    await this.movementRepository.update({ id: movementId }, {
      approvalStatus: MovementApprovalStatus.FULLY_APPROVED,
      updatedAt: new Date()
    });

    console.log(`Movimiento ${movementId} aprobado por Administrador de Personal: ${approvedBy}`);

    return await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });
  }

  /**
   * Rechaza un movimiento
   */
  async rejectMovement(
    movementId: string,
    rejectedBy: string,
    comments: string,
    userSession?: UserSessionDto
  ): Promise<MovementEntity> {
    const movement = await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });

    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    if (movement.approvalStatus === MovementApprovalStatus.FULLY_APPROVED) {
      throw new BadRequestException('No se puede rechazar un movimiento ya aprobado completamente');
    }

    if (movement.approvalStatus === MovementApprovalStatus.REJECTED) {
      throw new BadRequestException('El movimiento ya fue rechazado');
    }

    // Actualizar el estado del movimiento
    await this.movementRepository.update({ id: movementId }, {
      approvalStatus: MovementApprovalStatus.REJECTED,
      updatedAt: new Date()
    });

    console.log(`Movimiento ${movementId} rechazado por: ${rejectedBy}. Motivo: ${comments}`);

    return await this.movementRepository.findOne({
      where: { id: movementId },
      relations: ['employee', 'incident']
    });
  }

  /**
   * Obtiene movimientos pendientes para Gerente de Zona
   */
  async getPendingForZoneManager(userSession?: UserSessionDto): Promise<MovementEntity[]> {
    return await this.movementRepository.find({
      where: { approvalStatus: MovementApprovalStatus.PENDING },
      relations: ['employee', 'incident'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Obtiene movimientos pendientes para Administrador de Personal
   */
  async getPendingForHRAdmin(userSession?: UserSessionDto): Promise<MovementEntity[]> {
    return await this.movementRepository.find({
      where: { approvalStatus: MovementApprovalStatus.APPROVED_BY_ZONE_MANAGER },
      relations: ['employee', 'incident'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Obtiene movimientos completamente aprobados (listos para generar CSV)
   */
  async getFullyApprovedMovements(userSession?: UserSessionDto): Promise<MovementEntity[]> {
    return await this.movementRepository.find({
      where: { approvalStatus: MovementApprovalStatus.FULLY_APPROVED },
      relations: ['employee', 'incident'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Verifica si se puede generar CSV
   */
  async canGenerateCSV(userSession?: UserSessionDto): Promise<boolean> {
    const fullyApprovedCount = await this.movementRepository.count({
      where: { approvalStatus: MovementApprovalStatus.FULLY_APPROVED }
    });

    return fullyApprovedCount > 0;
  }

  /**
   * Obtiene estadísticas de aprobación
   */
  async getApprovalStats(): Promise<{
    pending: number;
    approvedByZoneManager: number;
    fullyApproved: number;
    rejected: number;
    total: number;
  }> {
    const [pending, approvedByZoneManager, fullyApproved, rejected] = await Promise.all([
      this.movementRepository.count({
        where: { approvalStatus: MovementApprovalStatus.PENDING }
      }),
      this.movementRepository.count({
        where: { approvalStatus: MovementApprovalStatus.APPROVED_BY_ZONE_MANAGER }
      }),
      this.movementRepository.count({
        where: { approvalStatus: MovementApprovalStatus.FULLY_APPROVED }
      }),
      this.movementRepository.count({
        where: { approvalStatus: MovementApprovalStatus.REJECTED }
      })
    ]);

    return {
      pending,
      approvedByZoneManager,
      fullyApproved,
      rejected,
      total: pending + approvedByZoneManager + fullyApproved + rejected
    };
  }

  /**
   * Obtiene el estado actual del flujo de aprobación
   */
  async getApprovalFlow(): Promise<{
    step1: { name: string; count: number; status: string };
    step2: { name: string; count: number; status: string };
    step3: { name: string; count: number; status: string };
  }> {
    const stats = await this.getApprovalStats();

    return {
      step1: {
        name: 'Pendiente de Gerente de Zona',
        count: stats.pending,
        status: stats.pending > 0 ? 'waiting' : 'completed'
      },
      step2: {
        name: 'Pendiente de Administrador de Personal',
        count: stats.approvedByZoneManager,
        status: stats.approvedByZoneManager > 0 ? 'waiting' : 'completed'
      },
      step3: {
        name: 'Listo para generar CSV',
        count: stats.fullyApproved,
        status: stats.fullyApproved > 0 ? 'ready' : 'not_ready'
      }
    };
  }

  // TODO: Implementar validaciones de roles
  // private isZoneManager(userSession: UserSessionDto): boolean {
  //   return userSession.userRol === 2; // Gerente de Zona
  // }

  // private isHRAdmin(userSession: UserSessionDto): boolean {
  //   return userSession.userRol === 3; // Administrador de Personal
  // }
}
