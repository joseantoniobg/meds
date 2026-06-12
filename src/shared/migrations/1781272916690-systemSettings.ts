import { MigrationInterface, QueryRunner } from "typeorm";

export class SystemSettings1781272916690 implements MigrationInterface {
    name = 'SystemSettings1781272916690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_settings" ("id" smallint NOT NULL, "restrict_read_only_print" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_system_settings_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "system_settings" ("id", "restrict_read_only_print") VALUES (1, true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "system_settings"`);
    }

}
