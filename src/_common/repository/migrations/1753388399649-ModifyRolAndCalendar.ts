import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyRolAndCalendar1753388399649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE calendar
      ADD COLUMN calendar_status TINYINT NOT NULL DEFAULT 1 COMMENT '1 = activo, 0 = inactivo';
    `);

    await queryRunner.query(`
      UPDATE rol SET description = 'Access role for PlayCity HR with limited permissions' WHERE id = 1;
    `);
    await queryRunner.query(`
      UPDATE rol SET description = 'Regional manager with access to multiple company locations' WHERE id = 2;
    `);
    await queryRunner.query(`
      UPDATE rol SET description = 'Administrator responsible for staff operations in all branches' WHERE id = 3;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE rol SET description = 'LOW access role for PlayCity HR' WHERE id = 1;
    `);
    await queryRunner.query(`
      UPDATE rol SET description = 'Zone manager with access to multiple locations' WHERE id = 2;
    `);
    await queryRunner.query(`
      UPDATE rol SET description = 'Role for managing staff across locations' WHERE id = 3;
    `);
    await queryRunner.query(`
      ALTER TABLE calendar
      DROP COLUMN calendar_status;
    `);
  }
}
