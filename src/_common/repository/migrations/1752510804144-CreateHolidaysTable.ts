import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHolidaysTableMigrations1752510804144
  implements MigrationInterface
{
  name = "CreateHolidaysTableMigrations1752510804144";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE holidays (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha VARCHAR(50) NOT NULL,
        celebracion VARCHAR(255) NOT NULL,
        dia_semana VARCHAR(20) NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
    `);

    await queryRunner.query(`
      INSERT INTO holidays (fecha, celebracion, dia_semana, active) VALUES
      ('1 de enero', 'Año Nuevo', 'Miércoles', TRUE),
      ('2 de enero', 'Día del Duque de Berchtold', 'Jueves', TRUE),
      ('18 de Abril', 'Viernes Santo', 'Viernes', TRUE),
      ('21 de abril', 'Lunes de Pascua', 'Lunes', TRUE),
      ('1 de mayo', 'Día Internacional del Trabajo', 'Jueves', TRUE),
      ('29 de mayo', 'Día de la Ascensión', 'Jueves', TRUE),
      ('9 de Junio', 'Lunes de Pentecostés', 'Lunes', TRUE),
      ('19 de Junio', 'Corpus Cristi', 'Jueves', TRUE),
      ('1 de agosto', 'Día Nacional de Suiza', 'Viernes', TRUE),
      ('16 de septiembre', 'Independencia de México', 'Martes', TRUE),
      ('24 de noviembre', 'Zibelemärit (Berna)', 'Lunes', TRUE),
      ('24 de diciembre', 'Nochebuena**', 'Miércoles', TRUE),
      ('25 de diciembre', 'Navidad', 'Jueves', TRUE),
      ('26 de diciembre', 'San Esteban', 'Viernes', TRUE),
      ('31 de diciembre', 'Nochevieja**', 'Miércoles', TRUE);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE holidays`);
  }
}
