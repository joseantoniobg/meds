import { MigrationInterface, QueryRunner } from "typeorm";

export class RenewalDate1746479439303 implements MigrationInterface {
    name = 'RenewalDate1746479439303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD "renewal_date" date`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" ADD CONSTRAINT "FK_16283eac2ece9fc528832e7ebe7" FOREIGN KEY ("id_type") REFERENCES "medical_prescription_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "medical_prescription" SET "renewal_date" = next_working_day((coalesce(last_printed, initial_date) + renewal * interval '1 day')::DATE) WHERE "renewal_date" IS NULL and status = 1 AND renewal > 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP CONSTRAINT "FK_16283eac2ece9fc528832e7ebe7"`);
        await queryRunner.query(`ALTER TABLE "medical_prescription" DROP COLUMN "renewal_date"`);
    }

}
