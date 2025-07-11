import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { OfficeEntity } from './office.entity';
import { UserAccessEntity } from './user-access.entity';

@Entity('companies')
@Index('idx_company_status', ['companyStatus'])
@Index('idx_company_name', ['companyName'])
export class CompanyEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'company_name',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Nombre de la compañía'
  })
  companyName: string;

  @Column({ 
    name: 'company_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado de la compañía (1 = activo, 0 = inactivo)'
  })
  companyStatus: number;

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
  @OneToMany(() => OfficeEntity, office => office.company)
  offices: OfficeEntity[];

  @OneToMany(() => UserAccessEntity, userAccess => userAccess.company)
  userAccess: UserAccessEntity[];
}
