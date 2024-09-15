import { MigrationInterface, QueryRunner } from "typeorm";

export class First1726400564985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "is_authorized" TYPE VARCHAR USING "is_authorized"::VARCHAR`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "is_authorized" TYPE BOOLEAN USING "is_authorized"::BOOLEAN`);
    }

}
