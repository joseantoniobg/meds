import { MigrationInterface, QueryRunner } from "typeorm";

export class ReadOnly1751494032789 implements MigrationInterface {
    name = 'ReadOnly1751494032789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "read_only" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "read_only"`);
    }

}
