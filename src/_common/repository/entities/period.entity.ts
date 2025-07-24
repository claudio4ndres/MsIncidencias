import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('period')
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  periodName: string;

  @Column({ type: 'datetime' })
  periodStart: Date;

  @Column({ type: 'datetime' })
  periodEnd: Date;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  periodStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
