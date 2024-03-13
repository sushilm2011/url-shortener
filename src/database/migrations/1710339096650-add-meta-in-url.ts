import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaInUrl1710339096650 implements MigrationInterface {
  name = 'AddMetaInUrl1710339096650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP CONSTRAINT "UQ_0f6d0d6ae10c8ad5b67a8b55719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "custom_alias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD "score" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD "is_inactive" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD "deleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "is_inactive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP COLUMN "score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD "custom_alias" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD CONSTRAINT "UQ_0f6d0d6ae10c8ad5b67a8b55719" UNIQUE ("custom_alias")`,
    );
  }
}
