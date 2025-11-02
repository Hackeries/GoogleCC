import { format, addMinutes, parseISO, parse, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Format a selected time slot into a human-readable string.
 * Example: "Wednesday, March 12, 2025, 10:00 – 10:15"
 */
export const formatSelectedSlot = (
  slot: string | null,
  duration: number,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
): string | null => {
  if (!slot) return null;

  try {
    // Decode and parse ISO time
    const decodedSlot = decodeURIComponent(slot);
    const startTime = parseISO(decodedSlot);

    if (!isValid(startTime)) return null;

    // Convert to user's timezone
    const zonedStartTime = toZonedTime(startTime, timezone);
    const zonedEndTime = addMinutes(zonedStartTime, duration);

    // Date + time format
    const formattedDate = format(zonedStartTime, "EEEE, MMMM d, yyyy");
    const timeFormat = hourType === "12h" ? "h:mm a" : "HH:mm";
    const formattedTime = `${format(zonedStartTime, timeFormat)} – ${format(
      zonedEndTime,
      timeFormat
    )}`;

    return `${formattedDate}, ${formattedTime}`;
  } catch (err) {
    console.error("Error formatting slot:", err);
    return null;
  }
};

/**
 * Convert a time string to the user's timezone and format it in 12h or 24h format.
 * Example: "14:00" → "2:00 PM" (12h) or "14:00" (24h)
 */
export const formatSlot = (
  slot: string,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
): string => {
  try {
    const parsedTime = parse(slot, "HH:mm", new Date());
    if (!isValid(parsedTime)) return slot;

    const zonedTime = toZonedTime(parsedTime, timezone);
    return hourType === "12h"
      ? format(zonedTime, "h:mm a")
      : format(zonedTime, "HH:mm");
  } catch {
    return slot;
  }
};

/**
 * Decode an encoded time slot and return formatted time.
 * Example: Encoded ISO slot → "10:30 AM" (12h) or "10:30" (24h)
 */
export const decodeSlot = (
  encodedSlot: string | null,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
): string | null => {
  if (!encodedSlot) return null;

  try {
    const decodedSlot = decodeURIComponent(encodedSlot);
    const slotDate = parseISO(decodedSlot);

    if (!isValid(slotDate)) return null;

    const zonedSlotDate = toZonedTime(slotDate, timezone);
    return hourType === "12h"
      ? format(zonedSlotDate, "h:mm a")
      : format(zonedSlotDate, "HH:mm");
  } catch (err) {
    console.error("Error decoding slot:", err);
    return null;
  }
};
