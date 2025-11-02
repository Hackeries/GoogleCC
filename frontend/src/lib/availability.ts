import { DayOfWeekType } from "@/types/api.type";

// Short names for display
export const dayMapping: Record<DayOfWeekType, string> = {
  SUNDAY: "Sun",
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

export type Availability = {
  day: DayOfWeekType;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type WeeklyHoursFormData = {
  timeGap: number;
  availability: Availability[];
};

// Utility function to generate time slots (every 30min, etc.)
export const generateTimeSlots = (
  timeGap: number = 30,
  format: "12h" | "24h" = "24h"
): string[] => {
  const slots: string[] = [];
  const totalMinutes = 24 * 60;

  for (let minutes = 0; minutes < totalMinutes; minutes += timeGap) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const time =
      format === "12h"
        ? `${String(hours % 12 || 12).padStart(2, "0")}:${String(mins).padStart(
            2,
            "0"
          )} ${hours < 12 ? "AM" : "PM"}`
        : `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

    slots.push(time);
  }

  return slots;
};

// Default availability for all days
export const availabilityPlaceholder: Availability[] = [
  { day: "MONDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { day: "TUESDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { day: "WEDNESDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { day: "THURSDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { day: "FRIDAY", startTime: "09:00", endTime: "17:00", isAvailable: true },
  { day: "SATURDAY", startTime: "09:00", endTime: "17:00", isAvailable: false },
  { day: "SUNDAY", startTime: "09:00", endTime: "17:00", isAvailable: false },
];
