import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MovementEntity } from './movement.entity';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ApprovalType {
  DIA_DEVUELTO = 'dia_devuelto',
  MOVIMIENTO_PERIODO_ANTERIOR = 'movimiento_periodo_anterior',
  EXCEPCION_ESPECIAL = 'excepcion_especial'
}

@Entity('approvals')
export class ApprovalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ApprovalType,
    name: 'approval_type'
  })
  approvalType: ApprovalType;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING
  })
  status: ApprovalStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'requested_by' })
  requestedBy: string;

  @Column({ name: 'movement_id' })
  movementId: string;

  @Column({ name: 'related_movement_id', nullable: true })
  relatedMovementId: string; // Para días devueltos, referencia a la falta original

  @Column({ type: 'json', nullable: true })
  approvals: {
    approvedBy: string;
    approvedAt: Date;
    comments?: string;
  }[];

  @Column({ name: 'required_approvals', type: 'int', default: 2 })
  requiredApprovals: number;

  @Column({ name: 'final_approved_at', type: 'timestamp', nullable: true })
  finalApprovedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'requested_by' })
  requester: UserEntity;

  @ManyToOne(() => MovementEntity)
  @JoinColumn({ name: 'movement_id' })
  movement: MovementEntity;

  @ManyToOne(() => MovementEntity)
  @JoinColumn({ name: 'related_movement_id' })
  relatedMovement: MovementEntity;

  // Métodos auxiliares
  get currentApprovalCount(): number {
    return this.approvals?.length || 0;
  }

  get isFullyApproved(): boolean {
    return this.currentApprovalCount >= this.requiredApprovals;
  }

  get pendingApprovals(): number {
    return this.requiredApprovals - this.currentApprovalCount;
  }

  hasApprovedBy(userId: string): boolean {
    return this.approvals?.some(approval => approval.approvedBy === userId) || false;
  }
}
