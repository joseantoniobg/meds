import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTables1745538460684 implements MigrationInterface {
    name = 'NewTables1745538460684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medical_prescription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_patient" uuid NOT NULL, "initial_date" date NOT NULL, "renewal" integer NOT NULL, CONSTRAINT "PK_b7678b4dd46acc335f871344700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medical_prescription_medicine" ("id_medical_prescription" uuid NOT NULL, "id_medicine" uuid NOT NULL, "instruction_of_use" character varying(255) NOT NULL, "quantity" character varying(30) NOT NULL, CONSTRAINT "PK_5f85136bcbdb6ff3567ff301a74" PRIMARY KEY ("id_medical_prescription", "id_medicine"))`);
        await queryRunner.query(`CREATE TABLE "medicine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b9e0e6f37b7cadb5f402390928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD CONSTRAINT "FK_dff664d96221f28e98152ee0739" FOREIGN KEY ("id_patient") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" ADD CONSTRAINT "FK_fa8b242e8a289e9c42a59b437f4" FOREIGN KEY ("id_medical_prescription") REFERENCES "medical_prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" ADD CONSTRAINT "FK_326f0a61fea9c5e4c09d7da04b0" FOREIGN KEY ("id_medicine") REFERENCES "medicine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" DROP CONSTRAINT "FK_326f0a61fea9c5e4c09d7da04b0"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" DROP CONSTRAINT "FK_fa8b242e8a289e9c42a59b437f4"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP CONSTRAINT "FK_dff664d96221f28e98152ee0739"`);
        await queryRunner.query(`DROP TABLE "medicine"`);
        await queryRunner.query(`DROP TABLE "medical_prescription_medicine"`);
        await queryRunner.query(`DROP TABLE "medical_prescription"`);
    }

}
