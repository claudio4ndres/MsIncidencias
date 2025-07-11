import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';
import { OfficeEntity } from './office.entity';

@Entity('user_access')
@Index('idx_user_access_user_id', ['userId'])
@Index('idx_user_access_company_id', ['companyId'])
@Index('idx_user_access_office_id', ['officeId'])
@Index('idx_user_access_status', ['status'])
@Index('idx_user_access_composite', ['userId', 'companyId', 'officeId'])
export class UserAccessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'user_id',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'ID del usuario'
  })
  userId: string;

  @Column({ 
    name: 'company_id',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'ID de la compañía'
  })
  companyId: string;

  @Column({ 
    name: 'office_id',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'ID de la oficina'
  })
  officeId: string;

  @Column({ 
    name: 'status',
    type: 'int', 
    nullable: false,
    default: 1,
    comment: 'Estado del acceso (1 = activo, 0 = inactivo)'
  })
  status: number;

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
  @ManyToOne(() => UserEntity, user => user.userAccess, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CompanyEntity, company => company.userAccess, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => OfficeEntity, office => office.userAccess, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'office_id' })
  office: OfficeEntity;
}
