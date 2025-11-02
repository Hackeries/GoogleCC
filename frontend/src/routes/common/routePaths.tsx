// common/routePath.tsx

type RouteMap = Record<string, string>;

export const AUTH_ROUTES: RouteMap = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
} as const;

export const PROTECTED_ROUTES: RouteMap = {
  DASHBOARD: "/app/dashboard",
  EVENT_TYPES: "/app/event_types",
  MEETINGS: "/app/scheduled_events",
  AVAILABILITY: "/app/availability/schedules",
  CALENDAR: "/app/calendar",
  ENHANCED_CALENDAR: "/app/google-calendar",
  INTEGRATIONS: "/app/integrations",
  ANALYTICS: "/app/analytics",
  TEAM: "/app/team",
  SETTINGS: "/app/settings",
  HELP: "/app/help",
} as const;

export const PUBLIC_ROUTES: RouteMap = {
  USER_EVENTS: "/:username",
  USER_SINGLE_EVENT: "/:username/:slug",
} as const;

export const isAuthRoute = (pathname: string): boolean => {
  const cleanPath = pathname.split("?")[0];
  return Object.values(AUTH_ROUTES).includes(cleanPath);
};

export const isProtectedRoute = (pathname: string): boolean => {
  const cleanPath = pathname.split("?")[0];
  return Object.values(PROTECTED_ROUTES).includes(cleanPath);
};

export const isPublicRoute = (pathname: string): boolean => {
  const cleanPath = pathname.split("?")[0];
  return Object.values(PUBLIC_ROUTES).some((route) =>
    cleanPath.startsWith(route.replace("/:username", ""))
  );
};
