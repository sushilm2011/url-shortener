import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLinkAccessEventEntity1710310666532
  implements MigrationInterface
{
  name = 'AddLinkAccessEventEntity1710310666532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url_shortener_schema"."link_access_event" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "long_url" character varying NOT NULL, "alias" character varying NOT NULL, "access_timestamp" TIMESTAMP NOT NULL, "request_id" character varying NOT NULL, "host" character varying, "referrer" character varying, "user_agent" character varying, "language" character varying, "platform" character varying, "ip" character varying, CONSTRAINT "PK_f428b8e4a65ad81db3c323314aa" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "url_shortener_schema"."link_access_event"`,
    );
  }
}
