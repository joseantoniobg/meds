import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYellowPrescriptionType1738700000000 implements MigrationInterface {
    name = 'AddYellowPrescriptionType1738700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "medical_prescription_type" ("id", "description") VALUES (3, 'Amarela') ON CONFLICT (id) DO NOTHING`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "medical_prescription_type" WHERE "id" = 3`);
    }

}
