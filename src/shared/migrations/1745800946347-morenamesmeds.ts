import { MigrationInterface, QueryRunner } from "typeorm";

export class Morenamesmeds1745800946347 implements MigrationInterface {
    name = 'Morenamesmeds1745800946347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "medicine" ADD "name" character varying(400) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "medicine" ADD "name" character varying(100) NOT NULL`);
    }

}
