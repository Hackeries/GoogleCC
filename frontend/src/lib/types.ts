import googleMeetLogo from "@/assets/google-meet.svg";
import googleCalendarLogo from "@/assets/google-calendar.svg";
import outlookCalendarLogo from "@/assets/microsoft-outlook.svg";
import microsoftTeamsLogo from "@/assets/microsoft-teams.svg";
import zoomLogo from "@/assets/zoom.svg";

/** Enum for supported integration apps */
export enum IntegrationAppEnum {
  GOOGLE_MEET_AND_CALENDAR = "GOOGLE_MEET_AND_CALENDAR",
  ZOOM_MEETING = "ZOOM_MEETING",
  MICROSOFT_TEAMS = "MICROSOFT_TEAMS",
  OUTLOOK_CALENDAR = "OUTLOOK_CALENDAR",
}

/** Type for all possible integration apps */
export type IntegrationAppType = keyof typeof IntegrationAppEnum;

/** Mapping of integration logos */
export const IntegrationLogos: Record<IntegrationAppType, string | string[]> = {
  GOOGLE_MEET_AND_CALENDAR: [googleMeetLogo, googleCalendarLogo],
  ZOOM_MEETING: zoomLogo,
  MICROSOFT_TEAMS: microsoftTeamsLogo,
  OUTLOOK_CALENDAR: outlookCalendarLogo,
};

/** User-friendly integration titles */
export type IntegrationTitleType =
  | "Google Meet & Calendar"
  | "Zoom"
  | "Microsoft Teams"
  | "Outlook Calendar";

/** Short descriptions for integrations */
export const IntegrationDescriptions: Record<IntegrationAppType, string> = {
  GOOGLE_MEET_AND_CALENDAR:
    "Include Google Meet details in your Meetly events and sync with Google Calendar.",
  ZOOM_MEETING: "Include Zoom details in your Meetly events.",
  MICROSOFT_TEAMS:
    "Microsoft Teams integration for video conferencing and collaboration.",
  OUTLOOK_CALENDAR:
    "Outlook Calendar integration for scheduling and reminders.",
};

/** Enum for supported conferencing platforms (used in event creation, etc.) */
export enum VideoConferencingPlatform {
  GOOGLE_MEET_AND_CALENDAR = IntegrationAppEnum.GOOGLE_MEET_AND_CALENDAR,
  ZOOM_MEETING = IntegrationAppEnum.ZOOM_MEETING,
  MICROSOFT_TEAMS = IntegrationAppEnum.MICROSOFT_TEAMS,
}

/** Location dropdown options for event creation UI */
export const locationOptions = [
  {
    label: "Google Meet",
    value: VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR,
    logo: Array.isArray(IntegrationLogos.GOOGLE_MEET_AND_CALENDAR)
      ? IntegrationLogos.GOOGLE_MEET_AND_CALENDAR[0]
      : IntegrationLogos.GOOGLE_MEET_AND_CALENDAR,
    isAvailable: true,
  },
  {
    label: "Zoom",
    value: VideoConferencingPlatform.ZOOM_MEETING,
    logo: IntegrationLogos.ZOOM_MEETING,
    isAvailable: false,
  },
  {
    label: "Microsoft Teams",
    value: VideoConferencingPlatform.MICROSOFT_TEAMS,
    logo: IntegrationLogos.MICROSOFT_TEAMS,
    isAvailable: false,
  },
];
