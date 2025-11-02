import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMeetLinkToEvent1762071448241 implements MigrationInterface {
    name = 'AddMeetLinkToEvent1762071448241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "isPrivate"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "duration" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "is_public" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "events" ADD "meet_link" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."integrations_provider_enum" RENAME TO "integrations_provider_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."integrations_provider_enum" AS ENUM('GOOGLE', 'ZOOM', 'MICROSOFT')`);
        await queryRunner.query(`ALTER TABLE "integrations" ALTER COLUMN "provider" TYPE "public"."integrations_provider_enum" USING "provider"::"text"::"public"."integrations_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."integrations_provider_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum" RENAME TO "events_locationtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum" AS ENUM('google_meet', 'zoom', 'physical', 'other')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum" USING "locationType"::"text"::"public"."events_locationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum_old" AS ENUM('GOOGLE_MEET_AND_CALENDAR', 'ZOOM_MEETING')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum_old" USING "locationType"::"text"::"public"."events_locationtype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum_old" RENAME TO "events_locationtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."integrations_provider_enum_old" AS ENUM('GOOGLE', 'ZOOM')`);
        await queryRunner.query(`ALTER TABLE "integrations" ALTER COLUMN "provider" TYPE "public"."integrations_provider_enum_old" USING "provider"::"text"::"public"."integrations_provider_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."integrations_provider_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."integrations_provider_enum_old" RENAME TO "integrations_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "meet_link"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "is_public"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
    }

}
