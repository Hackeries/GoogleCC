import { google } from "googleapis";

export const createGoogleEvent = async (access_token: string, payload: any) => {
  try {
    const client = new google.auth.OAuth2();
    client.setCredentials({ access_token });

    const calendar = google.calendar({ version: "v3", auth: client });

    const res = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: payload.title,
        description: payload.description,
        start: { dateTime: payload.start_time, timeZone: payload.timezone },
        end: { dateTime: payload.end_time, timeZone: payload.timezone },
        conferenceData: {
          createRequest: { requestId: `meetly-${Date.now()}` },
        },
      },
    });

    return res.data; // contains conferenceData, hangoutLink
  } catch (error: any) {
    console.error("❌ Google event creation failed:", error.message);
    throw error;
  }
};
