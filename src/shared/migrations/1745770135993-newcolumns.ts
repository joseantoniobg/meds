import { MigrationInterface, QueryRunner } from 'typeorm';

export class Newcolumns1745770135993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_prescription" ADD "id_user" uuid not null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
