import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  fecha: string;

  @Column({ type: 'varchar', length: 255 })
  celebracion: string;

  @Column({ type: 'varchar', length: 20, name: 'dia_semana' })
  diaSemana: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
