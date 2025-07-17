import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApprovalsTable1752679258000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the table structure first
    await queryRunner.query(`
      CREATE TABLE \`approvals\` (
        \`id\` varchar(36) NOT NULL DEFAULT (UUID()),
        \`approval_type\` enum ('dia_devuelto', 'movimiento_periodo_anterior', 'excepcion_especial') NOT NULL,
        \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
        \`reason\` text NOT NULL,
        \`comments\` text NULL,
        \`requested_by\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`movement_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`related_movement_id\` varchar(191) COLLATE utf8mb4_unicode_ci NULL,
        \`approvals\` json NULL,
        \`required_approvals\` int NOT NULL DEFAULT 2,
        \`final_approved_at\` timestamp NULL,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Add indices
    await queryRunner.query(`CREATE INDEX \`idx_approval_status\` ON \`approvals\` (\`status\`)`);
    await queryRunner.query(`CREATE INDEX \`idx_approval_type\` ON \`approvals\` (\`approval_type\`)`);
    await queryRunner.query(`CREATE INDEX \`idx_movement_id\` ON \`approvals\` (\`movement_id\`)`);
    await queryRunner.query(`CREATE INDEX \`idx_related_movement_id\` ON \`approvals\` (\`related_movement_id\`)`);
    await queryRunner.query(`CREATE INDEX \`idx_requested_by\` ON \`approvals\` (\`requested_by\`)`);
    await queryRunner.query(`CREATE INDEX \`idx_created_at\` ON \`approvals\` (\`created_at\`)`);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE \`approvals\`
      ADD CONSTRAINT \`FK_approvals_requested_by\`
      FOREIGN KEY (\`requested_by\`) REFERENCES \`users\`(\`id\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`approvals\`
      ADD CONSTRAINT \`FK_approvals_movement_id\`
      FOREIGN KEY (\`movement_id\`) REFERENCES \`movements\`(\`id\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`approvals\`
      ADD CONSTRAINT \`FK_approvals_related_movement_id\`
      FOREIGN KEY (\`related_movement_id\`) REFERENCES \`movements\`(\`id\`)
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("approvals");
  }
}
