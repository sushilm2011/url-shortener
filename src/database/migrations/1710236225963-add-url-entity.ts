import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlEntity1710236225963 implements MigrationInterface {
  name = 'AddUrlEntity1710236225963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url_shortener_schema"."url" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "long_url" character varying NOT NULL, "alias" character varying NOT NULL, "custom_alias" character varying, CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "url_shortener_schema"."url"`);
  }
}
