import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumns1745608562451 implements MigrationInterface {
    name = 'AddNewColumns1745608562451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "status" smallint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "medicine" ADD "useMethod" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "useMethod"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "status"`);
    }

}
