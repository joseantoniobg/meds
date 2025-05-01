import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumnsAndStatus1746010972575 implements MigrationInterface {
    name = 'NewColumnsAndStatus1746010972575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medical_prescription_status" ("id" smallint NOT NULL, "description" character varying(50) NOT NULL, CONSTRAINT "PK_a1d053158ff572c920787c7330e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "medical_prescription_status"("id", "description") VALUES (1, 'Ativa'), (0, 'Cancelada')`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "last_printed" date`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD CONSTRAINT "FK_334cbe87501c0faa104df42caad" FOREIGN KEY ("status") REFERENCES "medical_prescription_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP CONSTRAINT "FK_334cbe87501c0faa104df42caad"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription_medicine" ADD "quantity" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "last_printed"`);
        await queryRunner.query(`DROP TABLE "medical_prescription_status"`);
    }

}
