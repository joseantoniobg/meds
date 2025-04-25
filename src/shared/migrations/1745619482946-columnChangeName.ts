import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnChangeName1745619482946 implements MigrationInterface {
    name = 'ColumnChangeName1745619482946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" RENAME COLUMN "useMethod" TO "use_method"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" RENAME COLUMN "use_method" TO "useMethod"`);
    }

}
