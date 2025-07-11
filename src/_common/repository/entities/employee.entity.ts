import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { OfficeEntity } from './office.entity';
import { MovementEntity } from './movement.entity';

@Entity('employees')
@Index('idx_employee_office_id', ['officeId'])
@Index('idx_employee_code', ['employeeCode'])
@Index('idx_employee_status', ['employeeStatus'])
@Index('idx_employee_type', ['employeeType'])
export class EmployeeEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'office_id',
    type: 'varchar', 
    length: 191, 
    nullable: false
  })
  officeId: string;

  @Column({ 
    name: 'employee_code',
    type: 'int', 
    nullable: false,
    unique: true,
    comment: 'Código único del empleado'
  })
  employeeCode: number;

  @Column({ 
    name: 'employee_name',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Nombre del empleado'
  })
  employeeName: string;

  @Column({ 
    name: 'employee_type',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Tipo de empleado'
  })
  employeeType: string;

  @Column({ 
    name: 'employee_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado del empleado (1 = activo, 0 = inactivo)'
  })
  employeeStatus: number;

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
  @ManyToOne(() => OfficeEntity, office => office.employees, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'office_id' })
  office: OfficeEntity;

  @OneToMany(() => MovementEntity, movement => movement.employee)
  movements: MovementEntity[];
}
