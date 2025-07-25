import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("calendar")
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  month: string;

  @Column({ type: "varchar", length: 255 })
  period: string;

  @Column({ type: "varchar", length: 255, name: "range" })
  range: string;

  @Column({ type: "datetime" })
  incidentSubmission: Date;

  @Column({ type: "datetime" })
  process: Date;

  @Column({ type: "datetime" })
  policyGeneration: Date;

  @Column({ type: "datetime" })
  payment: Date;

  @Column({
    name: "calendar_status",
    type: "int",
    nullable: false,
    comment: "Estado del calendar (1 = activo, 0 = inactivo)",
  })
  calendarStatus: number;
}
