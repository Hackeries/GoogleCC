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
          {protectedRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Redirect /app to Dashboard */}
          <Route
            path="/app"
            element={<Navigate to="/app/dashboard" replace />}
          />
        </Route>
      </Route>

      {/* ---------- 404 Page ---------- */}
      <Route path="*" element={<>404 - Page Not Found</>} />
    </Routes>
  );
}

export default AppRoutes;
