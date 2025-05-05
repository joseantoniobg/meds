import { MigrationInterface, QueryRunner } from "typeorm";

export class MpType1746399850084 implements MigrationInterface {
    name = 'MpType1746399850084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medical_prescription_type" ("id" smallint NOT NULL, "description" character varying(50) NOT NULL, CONSTRAINT "PK_2a09da80c3e0dba158f4e5ffc23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "type" smallint DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "medical_prescription_type"`);
    }

}
