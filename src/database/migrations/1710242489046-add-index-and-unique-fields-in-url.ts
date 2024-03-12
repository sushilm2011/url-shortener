import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexAndUniqueFieldsInUrl1710242489046
  implements MigrationInterface
{
  name = 'AddIndexAndUniqueFieldsInUrl1710242489046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD CONSTRAINT "UQ_ec67d700c5e068763c1fa0dd30f" UNIQUE ("alias")`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" ADD CONSTRAINT "UQ_0f6d0d6ae10c8ad5b67a8b55719" UNIQUE ("custom_alias")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec67d700c5e068763c1fa0dd30" ON "url_shortener_schema"."url" ("alias") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "url_shortener_schema"."IDX_ec67d700c5e068763c1fa0dd30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP CONSTRAINT "UQ_0f6d0d6ae10c8ad5b67a8b55719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_shortener_schema"."url" DROP CONSTRAINT "UQ_ec67d700c5e068763c1fa0dd30f"`,
    );
  }
}
