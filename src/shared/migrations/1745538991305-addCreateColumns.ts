import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreateColumns1745538991305 implements MigrationInterface {
    name = 'AddCreateColumns1745538991305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "created_at"`);
    }

}
