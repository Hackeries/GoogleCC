import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routePaths";
import SignIn from "@/pages/auth/signin";
import SignUp from "@/pages/auth/signup";
import Dashboard from "@/pages/dashboard/index";
import EventType from "@/pages/event_type";
import Meetings from "@/pages/meeting";
import Availability from "@/pages/availability";
import EnhancedCalendar from "@/pages/calendar/EnhancedCalendar";
import Integrations from "@/pages/integrations";
import Analytics from "@/pages/analytics/index";
import Team from "@/pages/team/index";
import Settings from "@/pages/settings/index";
import Help from "@/pages/help/index";
import UserEventsPage from "@/pages/external_page/user-events";
import UserSingleEventPage from "@/pages/external_page/user-single-event";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.EVENT_TYPES, element: <EventType /> },
  { path: PROTECTED_ROUTES.MEETINGS, element: <Meetings /> },
  { path: PROTECTED_ROUTES.AVAILABILITY, element: <Availability /> },
  { path: PROTECTED_ROUTES.ENHANCED_CALENDAR, element: <EnhancedCalendar /> },
  { path: PROTECTED_ROUTES.INTEGRATIONS, element: <Integrations /> },
  { path: PROTECTED_ROUTES.ANALYTICS, element: <Analytics /> },
  { path: PROTECTED_ROUTES.TEAM, element: <Team /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.HELP, element: <Help /> },
];

export const publicRoutePaths = [
  { path: PUBLIC_ROUTES.USER_EVENTS, element: <UserEventsPage /> },
  { path: PUBLIC_ROUTES.USER_SINGLE_EVENT, element: <UserSingleEventPage /> },
];
