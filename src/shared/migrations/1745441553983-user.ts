import { MigrationInterface, QueryRunner } from "typeorm";

export class User1745441553983 implements MigrationInterface {
    name = 'User1745441553983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "status" smallint NOT NULL DEFAULT '1', "password" character varying(256) NOT NULL, "refresh_token" text, "update_password" boolean NOT NULL DEFAULT true, "cancelled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "ix_login" ON "user" ("login") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab8e7ceb94fc5e46c516231008" ON "user" ("login", "password") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ab8e7ceb94fc5e46c516231008"`);
        await queryRunner.query(`DROP INDEX "public"."ix_login"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
