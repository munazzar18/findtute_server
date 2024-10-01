import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1727541273724 implements MigrationInterface {
    name = 'InitialMigration1727541273724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "username" character varying NOT NULL DEFAULT 'username'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "username"`);
    }

}
