"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationsUpdateUsersTable1752099387171 = void 0;
class MigrationsUpdateUsersTable1752099387171 {
    constructor() {
        this.name = "MigrationsUpdateUsersTable1752099387171";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`users_company_id_fkey\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`users_office_id_fkey\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`company_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`office_id\``);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`company_id\` VARCHAR(191) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`office_id\` VARCHAR(191) NOT NULL`);
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
exports.MigrationsUpdateUsersTable1752099387171 = MigrationsUpdateUsersTable1752099387171;
//# sourceMappingURL=1752099387171-MigrationsUpdateUsersTable.js.map