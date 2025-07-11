"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1751925896606 = void 0;
class Migrations1751925896606 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE calendar`);
    }
}
exports.Migrations1751925896606 = Migrations1751925896606;
//# sourceMappingURL=1751925896606-migrations.js.map