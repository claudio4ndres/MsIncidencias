import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { IncidentEntity } from './incident.entity';

export enum MovementApprovalStatus {
  PENDING = 'pending',
  APPROVED_BY_ZONE_MANAGER = 'approved_by_zone_manager',
  APPROVED_BY_HR_ADMIN = 'approved_by_hr_admin',
  FULLY_APPROVED = 'fully_approved',
  REJECTED = 'rejected'
}

@Entity('movements')
@Index('idx_movement_employee_code', ['employeeCode'])
@Index('idx_movement_incident_code', ['incidentCode'])
@Index('idx_movement_status', ['incidenceStatus'])
@Index('idx_movement_date', ['incidenceDate'])
export class MovementEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'employee_code',
    type: 'int', 
    nullable: false
  })
  employeeCode: number;

  @Column({ 
    name: 'incident_code',
    type: 'varchar', 
    length: 191, 
    nullable: false
  })
  incidentCode: string;

  @Column({ 
    name: 'incidence_date',
    type: 'datetime', 
    precision: 3,
    nullable: false,
    comment: 'Fecha de la incidencia'
  })
  incidenceDate: Date;

  @Column({ 
    name: 'incidence_observation',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Observaciones de la incidencia'
  })
  incidenceObservation: string;

  @Column({ 
    name: 'incidence_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado de la incidencia (1 = activo, 0 = inactivo)'
  })
  incidenceStatus: number;

  @Column({
    name: 'approval_status',
    type: 'enum',
    enum: MovementApprovalStatus,
    default: MovementApprovalStatus.PENDING,
    comment: 'Estado de aprobación del movimiento'
  })
  approvalStatus: MovementApprovalStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'Fecha y hora de creación del registro'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 6,
    comment: 'Fecha y hora de última actualización del registro'
  })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => EmployeeEntity, employee => employee.movements, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'employee_code', referencedColumnName: 'employeeCode' })
  employee: EmployeeEntity;

  @ManyToOne(() => IncidentEntity, incident => incident.movements, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'incident_code', referencedColumnName: 'incidentCode' })
  incident: IncidentEntity;
}
