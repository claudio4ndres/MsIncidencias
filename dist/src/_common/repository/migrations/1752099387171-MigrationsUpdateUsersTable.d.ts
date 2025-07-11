import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MigrationsUpdateUsersTable1752099387171 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
