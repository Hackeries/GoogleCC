import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import {
  CreateEventDto,
  EventIdDTO,
  UserNameAndSlugDTO,
  UserNameDTO,
} from "../database/dto/event.dto";
import {
  createEventService,
  deleteEventService,
  getPublicEventByUsernameAndSlugService,
  getPublicEventsByUsernameService,
  getUserEventsService,
  toggleEventPrivacyService,
} from "../services/event.service";
import { asyncHandler } from "../middlewares/asyncHandler.middeware";
import { createGoogleEvent } from "../lib/google";
import { supabase } from "../lib/supabaseClient";
import { EventLocationEnumType } from "../database/entities/event.entity";

/**
 * ✅ Create a new event
 */
export const createEventController = asyncHandlerAndValidation(
  CreateEventDto,
  "body",
  async (req: Request, res: Response, createEventDto) => {
    const userId = req.user?.id as string;

    // Step 1: Create event in DB
    const event = await createEventService(userId, createEventDto);

    // Step 2: If location is Google Meet, also create in Google Calendar
    if (createEventDto.locationType === EventLocationEnumType.GOOGLE_MEET_AND_CALENDAR) {
      try {
        const { data: integration, error } = await supabase
          .from("integrations")
          .select("access_token")
          .eq("user_id", userId)
          .eq("platform", "google")
          .maybeSingle(); // ✅ safer than .single()

        if (error) {
          console.error("⚠️ Error fetching Google token:", error.message);
        }

        if (integration?.access_token) {
          const googleEvent = await createGoogleEvent(
            integration.access_token,
            createEventDto
          );

          if (googleEvent?.hangoutLink) {
            const { error: updateError } = await supabase
              .from("events")
              .update({ meet_link: googleEvent.hangoutLink }) // ✅ match DB naming (snake_case)
              .eq("id", event.id);

            if (updateError) {
              console.error(
                "⚠️ Failed to update meet link:",
                updateError.message
              );
            } else {
              event.meetLink = googleEvent.hangoutLink;
            }
          }
        } else {
          console.warn("⚠️ No Google integration found for user", userId);
        }
      } catch (err: any) {
        console.error("❌ Google event creation failed:", err.message);
      }
    }

    // Step 3: Respond
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created successfully",
      data: event,
    });
  }
);

/**
 * ✅ Get all events for a user
 */
export const getUserEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { events, username } = await getUserEventsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User events fetched successfully",
      data: { events, username },
    });
  }
);

/**
 * ✅ Toggle event visibility (Public / Private)
 */
export const toggleEventPrivacyController = asyncHandlerAndValidation(
  EventIdDTO,
  "params", // ✅ should come from URL params, not body
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;
    const event = await toggleEventPrivacyService(userId, eventIdDto.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${
        event.isPrivate ? "private" : "public"
      } successfully`,
      data: event,
    });
  }
);

/**
 * ✅ Get all public events for a username
 */
export const getPublicEventsByUsernameController = asyncHandlerAndValidation(
  UserNameDTO,
  "params",
  async (req: Request, res: Response, userNameDto) => {
    const { user, events } = await getPublicEventsByUsernameService(
      userNameDto.username
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Public events fetched successfully",
      data: { user, events },
    });
  }
);

/**
 * ✅ Get a single public event by username and slug
 */
export const getPublicEventByUsernameAndSlugController =
  asyncHandlerAndValidation(
    UserNameAndSlugDTO,
    "params",
    async (req: Request, res: Response, userNameAndSlugDto) => {
      const event = await getPublicEventByUsernameAndSlugService(
        userNameAndSlugDto
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Event details fetched successfully",
        data: event,
      });
    }
  );

/**
 * ✅ Delete an event
 */
export const deleteEventController = asyncHandlerAndValidation(
  EventIdDTO,
  "params",
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;
    await deleteEventService(userId, eventIdDto.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Event deleted successfully",
    });
  }
);
