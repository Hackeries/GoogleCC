// common/routePath.tsx

type RouteMap = Record<string, string>;

export const AUTH_ROUTES: RouteMap = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES: RouteMap = {
  EVENT_TYPES: "/app/event_types",
  INTEGRATIONS: "/app/integrations",
  AVAILABILITY: "/app/availability/schedules",
  MEETINGS: "/app/scheduled_events",
  CALENDAR: "/app/calendar", // ✅ added calendar route
};

export const PUBLIC_ROUTES: RouteMap = {
  USER_EVENTS: "/:username",
  USER_SINGLE_EVENT: "/:username/:slug",
};

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
