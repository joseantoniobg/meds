import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFunction1745799365192 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
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
            $$ LANGUAGE plpgsql;`
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
