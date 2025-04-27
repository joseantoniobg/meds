import { MigrationInterface, QueryRunner } from 'typeorm';

export class Holiday1745622535256 implements MigrationInterface {
  name = 'Holiday1745622535256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "holiday" ("date" date NOT NULL, "description" character varying(50) NOT NULL, CONSTRAINT "PK_89b26e4ed3db8895b86c8df55e8" PRIMARY KEY ("date"));

            CREATE OR REPLACE FUNCTION next_working_day(start_date DATE)
            RETURNS DATE AS $$
            DECLARE result_date DATE := start_date;
            BEGIN
                WHILE EXTRACT(DOW FROM result_date) IN (0, 6)
                    OR EXISTS (SELECT 1 FROM holiday WHERE date = result_date)
                LOOP
                    result_date := result_date - INTERVAL '1 day';
                END LOOP;

                RETURN result_date;
            END;
            $$ LANGUAGE plpgsql;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "holiday";
                                 DROP FUNCTION next_working_day;`);
  }
}
