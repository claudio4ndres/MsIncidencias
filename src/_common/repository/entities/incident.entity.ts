import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { MovementEntity } from './movement.entity';

@Entity('incidents')
@Index('idx_incident_code', ['incidentCode'])
@Index('idx_incident_status', ['incidentStatus'])
@Index('idx_incident_name', ['incidentName'])
export class IncidentEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'incident_code',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    unique: true,
    comment: 'Código único del incidente'
  })
  incidentCode: string;

  @Column({ 
    name: 'incident_name',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Nombre del incidente'
  })
  incidentName: string;

  @Column({ 
    name: 'incident_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado del incidente (1 = activo, 0 = inactivo)'
  })
  incidentStatus: number;

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
  @OneToMany(() => MovementEntity, movement => movement.incident)
  movements: MovementEntity[];
}
