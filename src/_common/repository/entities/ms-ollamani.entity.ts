import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ms_ollamani')
@Index('idx_ms_ollamani_activo', ['activo'])
@Index('idx_ms_ollamani_nombre', ['nombre'])
@Index('idx_ms_ollamani_fecha_creacion', ['fechaCreacion'])
export class MsOllamaniEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: false,
    comment: 'Nombre del elemento ollamani (máximo 100 caracteres)'
  })
  nombre: string;

  @Column({ 
    type: 'varchar', 
    length: 500, 
    nullable: false,
    comment: 'Descripción del elemento ollamani (máximo 500 caracteres)'
  })
  descripcion: string;

  @Column({ 
    type: 'boolean', 
    default: true,
    comment: 'Estado del registro (true = activo, false = inactivo)'
  })
  activo: boolean;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
    comment: 'Fecha y hora de creación del registro'
  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    comment: 'Fecha y hora de última actualización del registro'
  })
  fechaActualizacion: Date;
}
