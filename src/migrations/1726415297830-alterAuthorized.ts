import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAuthorized1726415297830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "user_entity"
            ALTER COLUMN "is_authorized" TYPE varchar USING "is_authorized"::varchar;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "user_entity"
            ALTER COLUMN "is_authorized" TYPE boolean USING "is_authorized"::boolean;
        `);
    }

}
