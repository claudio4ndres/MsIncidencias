import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { EmployeeEntity } from './employee.entity';
import { UserAccessEntity } from './user-access.entity';

@Entity('offices')
@Index('idx_office_company_id', ['companyId'])
@Index('idx_office_status', ['officeStatus'])
@Index('idx_office_name', ['officeName'])
export class OfficeEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'company_id',
    type: 'varchar', 
    length: 191, 
    nullable: false
  })
  companyId: string;

  @Column({ 
    name: 'office_name',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Nombre de la oficina'
  })
  officeName: string;

  @Column({ 
    name: 'office_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado de la oficina (1 = activo, 0 = inactivo)'
  })
  officeStatus: number;

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
  @ManyToOne(() => CompanyEntity, company => company.offices, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @OneToMany(() => EmployeeEntity, employee => employee.office)
  employees: EmployeeEntity[];

  @OneToMany(() => UserAccessEntity, userAccess => userAccess.office)
  userAccess: UserAccessEntity[];
}
