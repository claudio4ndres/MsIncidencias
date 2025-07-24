import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWeeklyRestDayToEmployees1752845118140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`employees\` 
            ADD COLUMN \`weekly_rest_day\` TINYINT NOT NULL DEFAULT 0 
            COMMENT 'Día de descanso semanal (0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado)'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`employees\` 
            DROP COLUMN \`weekly_rest_day\`
        `);
    }

}
