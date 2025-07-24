import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRol1752845465569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE rol (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    await queryRunner.query(`
        CREATE UNIQUE INDEX IDX_rol_name ON rol (name);
        `);

    await queryRunner.query(`
        INSERT INTO rol (id, name, description) VALUES
        (1, 'Recursos Humanos de PlayCity', 'LOW access role for PlayCity HR'),
        (2, 'Gerente de zona', 'Zone manager with access to multiple locations'),
        (3, 'Administrador de personal', 'Role for managing staff across locations');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX IDX_rol_name ON rol;
    `);
    await queryRunner.query(`
        DROP TABLE rol;
    `);
  }
}
