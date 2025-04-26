import { MigrationInterface, QueryRunner } from "typeorm";

export class Mpemission1745621707433 implements MigrationInterface {
    name = 'Mpemission1745621707433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medical_prescription_emission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_batch" uuid NOT NULL, "is_daily_emission" boolean NOT NULL DEFAULT false, "id_medical_prescription" uuid NOT NULL, "initial_date" date NOT NULL, "html" character varying(2500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_137c8673e6d933b8fd35cb51a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" ADD CONSTRAINT "FK_9355208e3a4cd16a1ee0023bb4a" FOREIGN KEY ("id_medical_prescription") REFERENCES "medical_prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription_emission" DROP CONSTRAINT "FK_9355208e3a4cd16a1ee0023bb4a"`);
        await queryRunner.query(`DROP TABLE "medical_prescription_emission"`);
    }

}
