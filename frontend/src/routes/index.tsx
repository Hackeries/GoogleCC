import { Route, Routes, Navigate } from "react-router-dom";
import {
  authenticationRoutePaths,
  protectedRoutePaths,
  publicRoutePaths,
} from "./common/routes";
import AppLayout from "@/layout/app-layout";
import BaseLayout from "@/layout/base-layout";
import AuthRoute from "./authRoute";
import ProtectedRoute from "./protectedRoute";
import MyCalendar from "@/pages/calendar/MyCalendar"; // ✅ import your calendar page

function AppRoutes() {
  return (
    <Routes>
      {/* ---------- AUTH ROUTES (Login, Register) ---------- */}
      <Route path="/" element={<AuthRoute />}>
        <Route element={<BaseLayout />}>
          {authenticationRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      {/* ---------- PUBLIC ROUTES (Landing, Docs, etc.) ---------- */}
      <Route element={<BaseLayout />}>
        {publicRoutePaths.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* ---------- PROTECTED ROUTES (Require Login) ---------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* ✅ Custom Calendar Route */}
          <Route path="/app/my-calendar" element={<MyCalendar />} />

          {/* Existing protected routes */}
          {protectedRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* ✅ Redirect /app → /app/my-calendar */}
          <Route
            path="/app"
            element={<Navigate to="/app/my-calendar" replace />}
          />
        </Route>
      </Route>

      {/* ---------- 404 Page ---------- */}
      <Route path="*" element={<>404 - Page Not Found</>} />
    </Routes>
  );
}

export default AppRoutes;
