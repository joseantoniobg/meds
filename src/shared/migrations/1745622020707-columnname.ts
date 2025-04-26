import { MigrationInterface, QueryRunner } from "typeorm";

export class Columnname1745622020707 implements MigrationInterface {
    name = 'Columnname1745622020707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" RENAME COLUMN "initial_date" TO "date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" RENAME COLUMN "date" TO "initial_date"`);
    }

}
