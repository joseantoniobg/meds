import { MigrationInterface, QueryRunner } from "typeorm";

export class Tableschanges1745678836155 implements MigrationInterface {
    name = 'Tableschanges1745678836155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medical_prescription_emission_batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_daily_emission" boolean NOT NULL DEFAULT false, "date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_77694637376f00f8fbd3a069623" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" DROP COLUMN "is_daily_emission"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" ADD CONSTRAINT "FK_01089066de5b01d57c42dcdd7ee" FOREIGN KEY ("id_batch") REFERENCES "medical_prescription_emission_batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" DROP CONSTRAINT "FK_01089066de5b01d57c42dcdd7ee"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" ADD "is_daily_emission" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "medical_prescription_emission_batch"`);
    }

}
