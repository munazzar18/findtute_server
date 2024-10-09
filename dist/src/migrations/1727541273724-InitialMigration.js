"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1727541273724 = void 0;
class InitialMigration1727541273724 {
    constructor() {
        this.name = 'InitialMigration1727541273724';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "username" character varying NOT NULL DEFAULT 'username'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "username"`);
    }
}
exports.InitialMigration1727541273724 = InitialMigration1727541273724;
//# sourceMappingURL=1727541273724-InitialMigration.js.map