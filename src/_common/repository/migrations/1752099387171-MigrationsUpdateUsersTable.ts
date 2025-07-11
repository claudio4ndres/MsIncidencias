import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsUpdateUsersTable1752099387171
  implements MigrationInterface
{
  name = "MigrationsUpdateUsersTable1752099387171";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar claves foráneas primero
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`users_company_id_fkey\``
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`users_office_id_fkey\``
    );

    // Eliminar columnas company_id y office_id
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`company_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`office_id\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas de vuelta
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`company_id\` VARCHAR(191) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`office_id\` VARCHAR(191) NOT NULL`
    );

    // Restaurar claves foráneas
    await queryRunner.query(`
      ALTER TABLE \`users\`
      ADD CONSTRAINT \`users_company_id_fkey\`
      FOREIGN KEY (\`company_id\`) REFERENCES \`companies\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE \`users\`
      ADD CONSTRAINT \`users_office_id_fkey\`
      FOREIGN KEY (\`office_id\`) REFERENCES \`offices\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  }
}
