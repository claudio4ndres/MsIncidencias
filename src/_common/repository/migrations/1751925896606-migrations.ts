import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751925896606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE calendar (
            id INT NOT NULL AUTO_INCREMENT,
            month VARCHAR(255) NOT NULL,
            period VARCHAR(255) NOT NULL,
            \`range\` VARCHAR(255) NOT NULL,
            incidentSubmission DATETIME NOT NULL,
            \`process\` DATETIME NOT NULL,
            policyGeneration DATETIME NOT NULL,
            payment DATETIME NOT NULL,
            PRIMARY KEY (id)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE calendar`);
  }
}
