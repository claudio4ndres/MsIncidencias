import { Controller, Get, Post, Put, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { ApprovalService } from '../services/approval.service';
import { ApprovalEntity, ApprovalType } from '../../_common/repository/entities/approval.entity';

@Controller('approvals')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  /**
   * Obtiene todas las aprobaciones pendientes con información de estado
   */
  @Get('pending')
  async getPendingApprovals(): Promise<{
    approvals: ApprovalEntity[];
    summary: {
      total: number;
      byType: { [key: string]: number };
    };
  }> {
    const approvals = await this.approvalService.getPendingApprovals();
    
    const summary = {
      total: approvals.length,
      byType: approvals.reduce((acc, approval) => {
        acc[approval.approvalType] = (acc[approval.approvalType] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };
    
    return { approvals, summary };
  }

  /**
   * Crea una solicitud de aprobación para día devuelto
   */
  @Post('dia-devuelto')
  async createDiaDevueltoApproval(
    @Body() body: {
      movementId: string;
      requestedBy: string;
      reason: string;
      relatedMovementId: string; // ID de la falta anterior
    }
  ): Promise<ApprovalEntity> {
    return await this.approvalService.createApproval(
      ApprovalType.DIA_DEVUELTO,
      body.movementId,
      body.requestedBy,
      body.reason,
      body.relatedMovementId
    );
  }

  /**
   * Aprueba una solicitud
   */
  @Put(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() body: {
      approvedBy: string;
      comments?: string;
    }
  ): Promise<{
    approval: ApprovalEntity;
    message: string;
    isFullyApproved: boolean;
  }> {
    // Verificar si el usuario ya aprobó
    const hasApproved = await this.approvalService.hasUserApproved(id, body.approvedBy);
    if (hasApproved) {
      throw new BadRequestException('Este usuario ya ha aprobado esta solicitud');
    }

    const approval = await this.approvalService.approve(id, body.approvedBy, body.comments);
    
    const message = approval.isFullyApproved 
      ? `Solicitud completamente aprobada (${approval.currentApprovalCount}/${approval.requiredApprovals})`
      : `Aprobación parcial registrada (${approval.currentApprovalCount}/${approval.requiredApprovals}). Se requieren ${approval.pendingApprovals} aprobaciones más.`;
    
    return {
      approval,
      message,
      isFullyApproved: approval.isFullyApproved
    };
  }

  /**
   * Rechaza una solicitud
   */
  @Put(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() body: {
      rejectedBy: string;
      comments: string;
    }
  ): Promise<ApprovalEntity> {
    return await this.approvalService.reject(id, body.rejectedBy, body.comments);
  }

  /**
   * Verifica si existe aprobación para un día devuelto
   */
  @Get('dia-devuelto/:relatedMovementId/status')
  async checkDiaDevueltoApproval(
    @Param('relatedMovementId') relatedMovementId: string
  ): Promise<{ hasApproval: boolean }> {
    const hasApproval = await this.approvalService.hasApprovedDiaDevuelto(relatedMovementId);
    return { hasApproval };
  }

  // =====================================================
  // ENDPOINTS PARA FLUJO SECUENCIAL DE APROBACIÓN
  // =====================================================

  /**
   * Aprueba un movimiento por el Gerente de Zona
   */
  @Put('movements/:id/approve-zone-manager')
  async approveByZoneManager(
    @Param('id') id: string,
    @Body() body: {
      approvedBy: string;
      comments?: string;
    }
  ): Promise<{
    movement: any;
    message: string;
  }> {
    const movement = await this.approvalService.approveByZoneManager(
      id,
      body.approvedBy,
      body.comments
    );
    
    return {
      movement,
      message: 'Movimiento aprobado por Gerente de Zona. Ahora debe ser aprobado por el Administrador de Personal.'
    };
  }

  /**
   * Aprueba un movimiento por el Administrador de Personal
   */
  @Put('movements/:id/approve-hr-admin')
  async approveByHRAdmin(
    @Param('id') id: string,
    @Body() body: {
      approvedBy: string;
      comments?: string;
    }
  ): Promise<{
    movement: any;
    message: string;
  }> {
    const movement = await this.approvalService.approveByHRAdmin(
      id,
      body.approvedBy,
      body.comments
    );
    
    return {
      movement,
      message: 'Movimiento completamente aprobado. Ahora puede ser incluido en la generación de CSV.'
    };
  }

  /**
   * Rechaza un movimiento
   */
  @Put('movements/:id/reject')
  async rejectMovement(
    @Param('id') id: string,
    @Body() body: {
      rejectedBy: string;
      comments: string;
    }
  ): Promise<{
    movement: any;
    message: string;
  }> {
    const movement = await this.approvalService.rejectMovement(
      id,
      body.rejectedBy,
      body.comments
    );
    
    return {
      movement,
      message: 'Movimiento rechazado.'
    };
  }

  /**
   * Obtiene movimientos pendientes para Gerente de Zona
   */
  @Get('movements/pending-zone-manager')
  async getPendingForZoneManager(): Promise<{
    movements: any[];
    count: number;
  }> {
    const movements = await this.approvalService.getPendingForZoneManager();
    
    return {
      movements,
      count: movements.length
    };
  }

  /**
   * Obtiene movimientos pendientes para Administrador de Personal
   */
  @Get('movements/pending-hr-admin')
  async getPendingForHRAdmin(): Promise<{
    movements: any[];
    count: number;
  }> {
    const movements = await this.approvalService.getPendingForHRAdmin();
    
    return {
      movements,
      count: movements.length
    };
  }

  /**
   * Obtiene movimientos completamente aprobados (listos para CSV)
   */
  @Get('movements/fully-approved')
  async getFullyApprovedMovements(): Promise<{
    movements: any[];
    count: number;
    canGenerateCSV: boolean;
  }> {
    const movements = await this.approvalService.getFullyApprovedMovements();
    const canGenerateCSV = await this.approvalService.canGenerateCSV();
    
    return {
      movements,
      count: movements.length,
      canGenerateCSV
    };
  }

  /**
   * Obtiene estadísticas del flujo de aprobación
   */
  @Get('movements/approval-stats')
  async getApprovalStats(): Promise<{
    stats: any;
    flow: any;
  }> {
    const stats = await this.approvalService.getApprovalStats();
    const flow = await this.approvalService.getApprovalFlow();
    
    return {
      stats,
      flow
    };
  }

  /**
   * Verifica si se puede generar CSV
   */
  @Get('movements/can-generate-csv')
  async canGenerateCSV(): Promise<{ canGenerate: boolean }> {
    const canGenerate = await this.approvalService.canGenerateCSV();
    return { canGenerate };
  }
}
