import { MigrationInterface, QueryRunner } from 'typeorm';

export class Newcolumns21745770307486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_prescription" ADD CONSTRAINT "FK_9355208e3a4cd16a1ee0023bb4b" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
       ALTER TABLE "user" ADD crm varchar(50);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
