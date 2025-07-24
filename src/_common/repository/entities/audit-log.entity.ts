import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  userEmail: string;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ type: "json", nullable: true })
  body: any;

  @CreateDateColumn()
  timestamp: Date;
}
