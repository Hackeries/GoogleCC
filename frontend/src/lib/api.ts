import {
  AvailabilityType,
  CreateEventPayloadType,
  CreateMeetingType,
  GetAllIntegrationResponseType,
  LoginResponseType,
  loginType,
  MeetingType,
  PeriodType,
  PublicAvailabilityEventResponseType,
  PublicEventResponseType,
  PublicSingleEventDetailResponseType,
  registerType,
  ToggleEventVisibilityResponseType,
  UserAvailabilityResponseType,
  UserEventListResponse,
  UserMeetingsResponseType,
  IntegrationType,
  EventType, // ✅ added to fix missing reference
} from "@/types/api.type";
import { API, PublicAPI } from "./axios-client";
import { IntegrationAppType, VideoConferencingPlatform } from "./types";

// =========================
// 🔐 AUTHENTICATION APIS
// =========================
export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

// =========================
// 📅 EVENT APIS
// =========================
export const createEventMutationFn = async (
  data: CreateEventPayloadType
): Promise<{ message: string }> => {
  const response = await API.post("/events/create", data);
  return response.data;
};

// ✅ alias for compatibility
export const CreateEventMutationFn = createEventMutationFn;

export const toggleEventVisibilityMutationFn = async (data: {
  eventId: string;
}): Promise<ToggleEventVisibilityResponseType> => {
  const response = await API.put(`/events/${data.eventId}/toggle-privacy`, {});
  return response.data;
};

export const getEventListQueryFn = async (): Promise<UserEventListResponse> => {
  const response = await API.get("/events/all");
  return response.data;
};

export const deleteEventMutationFn = async (
  eventId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/events/${eventId}`);
  return response.data;
};

export const updateEventMutationFn = async (data: {
  eventId: string;
  title: string;
  description: string;
  duration: number;
  locationType: VideoConferencingPlatform;
}): Promise<{ message: string; data: EventType }> => {
  const response = await API.put(`/events/${data.eventId}`, {
    title: data.title,
    description: data.description,
    duration: data.duration,
    locationType: data.locationType,
  });
  return response.data;
};

// =========================
// 🔗 INTEGRATION APIS
// =========================
export const checkIntegrationQueryFn = async (
  appType: VideoConferencingPlatform
): Promise<{ isConnected: boolean }> => {
  const response = await API.get(`/integration/check/${appType}`);
  const data = response.data as { isConnected?: boolean; connected?: boolean };

  return {
    isConnected: data.isConnected ?? data.connected ?? false,
  };
};

// ✅ Type-safe normalization instead of `any`
export const getAllIntegrationQueryFn =
  async (): Promise<GetAllIntegrationResponseType> => {
    const response = await API.get("/integration/all");
    const data = response.data as GetAllIntegrationResponseType;

    const normalizedIntegrations: IntegrationType[] = (
      data.integrations || []
    ).map((integration: IntegrationType & { connected?: boolean }) => ({
      ...integration,
      isConnected: integration.isConnected ?? integration.connected ?? false,
    }));

    return {
      ...data,
      integrations: normalizedIntegrations,
    };
  };

export const connectAppIntegrationQueryFn = async (
  appType: IntegrationAppType
): Promise<{ redirectUrl: string }> => {
  const response = await API.get(`/integration/connect/${appType}`);
  return response.data;
};

// =========================
// 🕒 AVAILABILITY APIS
// =========================
export const getUserAvailabilityQueryFn =
  async (): Promise<UserAvailabilityResponseType> => {
    const response = await API.get("/availability/me");
    return response.data;
  };

export const updateUserAvailabilityMutationFn = async (
  data: AvailabilityType
): Promise<{ message: string }> => {
  const response = await API.put("/availability/update", data);
  return response.data;
};

// =========================
// 📞 MEETING APIS
// =========================
export const getUserMeetingsQueryFn = async (
  filter: PeriodType
): Promise<UserMeetingsResponseType> => {
  const response = await API.get(
    `/meeting/user/all${filter ? `?filter=${filter}` : ""}`
  );
  return response.data;
};

export const cancelMeetingMutationFn = async (
  meetingId: string
): Promise<{ message: string }> => {
  const response = await API.put(`/meeting/cancel/${meetingId}`, {});
  return response.data;
};

export const rescheduleMeetingMutationFn = async (data: {
  meetingId: string;
  startTime: string;
  endTime: string;
}): Promise<{ message: string; meeting: MeetingType }> => {
  const response = await API.put(`/meeting/reschedule/${data.meetingId}`, {
    startTime: data.startTime,
    endTime: data.endTime,
  });
  return response.data;
};

// =========================
// 📊 ANALYTICS APIS
// =========================
export interface DashboardAnalyticsResponse {
  message: string;
  data: {
    overview: {
      totalEvents: number;
      upcomingMeetings: number;
      totalMeetings: number;
      bookingRate: string;
    };
    topAttendees: Array<{
      name: string;
      email: string;
      meetingCount: number;
    }>;
    meetingsPerDay: Record<string, number>;
    recentMeetings: Array<{
      id: string;
      title: string;
      guestName: string;
      guestEmail: string;
      startTime: string;
      endTime: string;
      meetLink: string;
    }>;
    popularEvents: Array<{
      id: string;
      title: string;
      bookings: number;
    }>;
  };
}

export const getDashboardAnalyticsQueryFn =
  async (): Promise<DashboardAnalyticsResponse> => {
    const response = await API.get("/analytics/dashboard");
    return response.data;
  };

// =========================
// 🌐 PUBLIC / EXTERNAL APIS
// =========================
export const getAllPublicEventQueryFn = async (
  username: string
): Promise<PublicEventResponseType> => {
  const response = await PublicAPI.get(`/events/public/${username}`);
  return response.data;
};

export const getSinglePublicEventBySlugQueryFn = async (data: {
  username: string;
  slug: string;
}): Promise<PublicSingleEventDetailResponseType> => {
  const response = await PublicAPI.get(
    `/events/public/${data.username}/${data.slug}`
  );
  return response.data;
};

export const getPublicAvailabilityByEventIdQueryFn = async (
  eventId: string,
  timezone?: string
): Promise<PublicAvailabilityEventResponseType> => {
  const url = `/availability/public/${eventId}${
    timezone ? `?timezone=${timezone}` : ""
  }`;
  const response = await PublicAPI.get(url);
  return response.data;
};

// =========================
// 🗓️ SCHEDULE MEETING (PUBLIC)
// =========================
export interface ScheduleMeetingResponse {
  data?: {
    meetLink?: string;
  };
  meetLink?: string;
}

export const scheduleMeetingMutationFn = async (
  data: CreateMeetingType
): Promise<ScheduleMeetingResponse> => {
  const response = await API.post("/meeting/public/create", data);
  const result = response.data as Record<string, unknown>;

  // ✅ Normalize response
  const meetLink =
    (result.meetLink as string) ||
    (result.meetingLink as string) ||
    (result.link as string) ||
    "";

  return {
    data: { meetLink },
    meetLink,
  };
};
