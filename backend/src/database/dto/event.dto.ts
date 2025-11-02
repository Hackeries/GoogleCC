import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";
import { EventLocationEnumType } from "../entities/event.entity";

export class CreateEventDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Event title is required" })
  title: string;

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  // Ensure numeric even if sent as string
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Duration must be a number" })
  @IsNotEmpty({ message: "Duration is required" })
  duration: number;

  @IsEnum(EventLocationEnumType, {
    message:
      "Invalid location type. Must be one of: GOOGLE_MEET_AND_CALENDAR, ZOOM_MEETING, MICROSOFT_TEAMS, PHYSICAL, OTHER",
  })
  @IsNotEmpty({ message: "Location type is required" })
  locationType: EventLocationEnumType;
}

// ✅ For toggling/deleting events
export class EventIdDTO {
  @IsUUID(4, { message: "Invalid UUID format" })
  @IsNotEmpty({ message: "Event ID is required" })
  eventId: string;
}

export class UserNameDTO {
  @IsString()
  @IsNotEmpty({ message: "Username is required" })
  username: string;
}

export class UserNameAndSlugDTO {
  @IsString()
  @IsNotEmpty({ message: "Username is required" })
  username: string;

  @IsString()
  @IsNotEmpty({ message: "Slug is required" })
  slug: string;
}
