import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventLocationEnum1762071500000 implements MigrationInterface {
    name = 'UpdateEventLocationEnum1762071500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update enum to match frontend values
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum" RENAME TO "events_locationtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum" AS ENUM('GOOGLE_MEET_AND_CALENDAR', 'ZOOM_MEETING', 'MICROSOFT_TEAMS', 'PHYSICAL', 'OTHER')`);
        
        // Migrate existing data with case-insensitive mapping
        await queryRunner.query(`
            ALTER TABLE "events" 
            ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum" 
            USING (
                CASE "locationType"::text
                    WHEN 'google_meet' THEN 'GOOGLE_MEET_AND_CALENDAR'
                    WHEN 'zoom' THEN 'ZOOM_MEETING'
                    WHEN 'physical' THEN 'PHYSICAL'
                    WHEN 'other' THEN 'OTHER'
                    ELSE 'OTHER'
                END
            )::"public"."events_locationtype_enum"
        `);
        
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert back to lowercase enum
        await queryRunner.query(`CREATE TYPE "public"."events_locationtype_enum_old" AS ENUM('google_meet', 'zoom', 'physical', 'other')`);
        
        // Migrate data back to lowercase
        await queryRunner.query(`
            ALTER TABLE "events" 
            ALTER COLUMN "locationType" TYPE "public"."events_locationtype_enum_old" 
            USING (
                CASE "locationType"::text
                    WHEN 'GOOGLE_MEET_AND_CALENDAR' THEN 'google_meet'
                    WHEN 'ZOOM_MEETING' THEN 'zoom'
                    WHEN 'MICROSOFT_TEAMS' THEN 'zoom'
                    WHEN 'PHYSICAL' THEN 'physical'
                    WHEN 'OTHER' THEN 'other'
                    ELSE 'other'
                END
            )::"public"."events_locationtype_enum_old"
        `);
        
        await queryRunner.query(`DROP TYPE "public"."events_locationtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_locationtype_enum_old" RENAME TO "events_locationtype_enum"`);
    }
}
