import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1727795387897 implements MigrationInterface {
    name = 'InitialMigration1727795387897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "privacy_terms_conditions" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "privacy_terms_conditions"`);
    }

}
