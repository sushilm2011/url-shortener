import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUrlScoreToVisitCount1710351114199 implements MigrationInterface {
    name = 'UpdateUrlScoreToVisitCount1710351114199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" ADD "visit_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" ADD "request_limit" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "request_limit"`);
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "visit_count"`);
        await queryRunner.query(`ALTER TABLE "url_shortener_schema"."url" ADD "score" integer NOT NULL DEFAULT '0'`);
    }

}
