import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditLogsTable1752845800000 implements MigrationInterface {
  name = "CreateAuditLogsTable1752845800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "audit_logs",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "(UUID())",
          },
          {
            name: "userId",
            type: "varchar",
            length: "255",
          },
          {
            name: "userEmail",
            type: "varchar",
            length: "255",
          },
          {
            name: "method",
            type: "varchar",
            length: "10",
          },
          {
            name: "path",
            type: "varchar",
            length: "500",
          },
          {
            name: "body",
            type: "json",
            isNullable: true,
          },
          {
            name: "timestamp",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_AUDIT_LOGS_USER_ID",
            columnNames: ["userId"],
          },
          {
            name: "IDX_AUDIT_LOGS_USER_EMAIL",
            columnNames: ["userEmail"],
          },
          {
            name: "IDX_AUDIT_LOGS_METHOD",
            columnNames: ["method"],
          },
          {
            name: "IDX_AUDIT_LOGS_PATH",
            columnNames: ["path"],
          },
          {
            name: "IDX_AUDIT_LOGS_TIMESTAMP",
            columnNames: ["timestamp"],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("audit_logs");
  }
}
