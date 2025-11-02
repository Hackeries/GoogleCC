import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  createEventController,
  deleteEventController,
  getPublicEventByUsernameAndSlugController,
  getPublicEventsByUsernameController,
  getUserEventsController,
  toggleEventPrivacyController,
} from "../controllers/event.controller";

const eventRoutes = Router();

/**
 * @route   POST /api/events/create
 * @desc    Create a new event (requires JWT)
 */
eventRoutes.post("/create", passportAuthenticateJwt, createEventController);

/**
 * @route   GET /api/events/all
 * @desc    Fetch all events for the logged-in user
 */
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventsController);

/**
 * @route   PUT /api/events/:eventId/toggle-privacy
 * @desc    Toggle event privacy (public/private)
 */
eventRoutes.put(
  "/:eventId/toggle-privacy",
  passportAuthenticateJwt,
  toggleEventPrivacyController
);

/**
 * @route   DELETE /api/events/:eventId
 * @desc    Delete a specific event by ID (requires JWT)
 */
eventRoutes.delete("/:eventId", passportAuthenticateJwt, deleteEventController);

/**
 * @route   GET /api/events/public/:username
 * @desc    Get all public events for a user (no authentication required)
 */
eventRoutes.get("/public/:username", getPublicEventsByUsernameController);

/**
 * @route   GET /api/events/public/:username/:slug
 * @desc    Get a single public event by username and slug
 */
eventRoutes.get(
  "/public/:username/:slug",
  getPublicEventByUsernameAndSlugController
);

export default eventRoutes;
