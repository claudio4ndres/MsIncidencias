"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1751649331107 = void 0;
class Migrations1751649331107 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`companies\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`company_name\` VARCHAR(191) NOT NULL,
        \`company_status\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE \`offices\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`company_id\` VARCHAR(191) NOT NULL,
        \`office_name\` VARCHAR(191) NOT NULL,
        \`office_status\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE \`employees\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`office_id\` VARCHAR(191) NOT NULL,
        \`employee_code\` INTEGER NOT NULL,
        \`employee_name\` VARCHAR(191) NOT NULL,
        \`employee_type\` VARCHAR(191) NOT NULL,
        \`employee_status\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`employees_employee_code_key\`(\`employee_code\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE \`incidents\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`incident_code\` VARCHAR(191) NOT NULL,
        \`incident_name\` VARCHAR(191) NOT NULL,
        \`incident_status\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`incidents_incident_code_key\`(\`incident_code\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE \`movements\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`employee_code\` INTEGER NOT NULL,
        \`incident_code\` VARCHAR(191) NOT NULL,
        \`incidence_date\` DATETIME(3) NOT NULL,
        \`incidence_observation\` VARCHAR(191) NOT NULL,
        \`incidence_status\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`company_id\` VARCHAR(191) NOT NULL,
        \`office_id\` VARCHAR(191) NOT NULL,
        \`user_name\` VARCHAR(191) NOT NULL,
        \`user_email\` VARCHAR(191) NOT NULL,
        \`user_password\` VARCHAR(191) NOT NULL,
        \`user_status\` INTEGER NOT NULL,
        \`user_rol\` INTEGER NOT NULL,
        \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`users_user_email_key\`(\`user_email\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      ALTER TABLE \`offices\`
      ADD CONSTRAINT \`offices_company_id_fkey\`
      FOREIGN KEY (\`company_id\`) REFERENCES \`companies\`(\`id\`)
      ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
        await queryRunner.query(`
      ALTER TABLE \`employees\`
      ADD CONSTRAINT \`employees_office_id_fkey\`
      FOREIGN KEY (\`office_id\`) REFERENCES \`offices\`(\`id\`)
      ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
        await queryRunner.query(`
      ALTER TABLE \`movements\`
      ADD CONSTRAINT \`movements_employee_code_fkey\`
      FOREIGN KEY (\`employee_code\`) REFERENCES \`employees\`(\`employee_code\`)
      ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
        await queryRunner.query(`
      ALTER TABLE \`movements\`
      ADD CONSTRAINT \`movements_incident_code_fkey\`
      FOREIGN KEY (\`incident_code\`) REFERENCES \`incidents\`(\`incident_code\`)
      ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`movements\``);
        await queryRunner.query(`DROP TABLE \`incidents\``);
        await queryRunner.query(`DROP TABLE \`employees\``);
        await queryRunner.query(`DROP TABLE \`offices\``);
        await queryRunner.query(`DROP TABLE \`companies\``);
    }
}
exports.Migrations1751649331107 = Migrations1751649331107;
//# sourceMappingURL=1751649331107-migrations.js.map