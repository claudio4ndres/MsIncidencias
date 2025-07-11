"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserAccessTable1752082142338 = void 0;
class CreateUserAccessTable1752082142338 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`user_access\` (
                \`id\` VARCHAR(191) NOT NULL,
                \`user_id\` VARCHAR(191) NOT NULL COMMENT 'ID del usuario',
                \`company_id\` VARCHAR(191) NOT NULL COMMENT 'ID de la compañía',
                \`office_id\` VARCHAR(191) NOT NULL COMMENT 'ID de la oficina',
                \`status\` INTEGER NOT NULL DEFAULT 1 COMMENT 'Estado del acceso (1 = activo, 0 = inactivo)',
                \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'Fecha y hora de creación del registro',
                \`updated_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'Fecha y hora de última actualización del registro',
                PRIMARY KEY (\`id\`),
                INDEX \`idx_user_access_user_id\` (\`user_id\`),
                INDEX \`idx_user_access_company_id\` (\`company_id\`),
                INDEX \`idx_user_access_office_id\` (\`office_id\`),
                INDEX \`idx_user_access_status\` (\`status\`),
                INDEX \`idx_user_access_composite\` (\`user_id\`, \`company_id\`, \`office_id\`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_access\`
            ADD CONSTRAINT \`user_access_user_id_fkey\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE CASCADE;
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_access\`
            ADD CONSTRAINT \`user_access_company_id_fkey\`
            FOREIGN KEY (\`company_id\`) REFERENCES \`companies\`(\`id\`)
            ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_access\`
            ADD CONSTRAINT \`user_access_office_id_fkey\`
            FOREIGN KEY (\`office_id\`) REFERENCES \`offices\`(\`id\`)
            ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE user_access`);
    }
}
exports.CreateUserAccessTable1752082142338 = CreateUserAccessTable1752082142338;
//# sourceMappingURL=1752082142338-CreateUserAccessTable.js.map