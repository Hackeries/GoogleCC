import { Router } from "express";
import { getDashboardAnalyticsController } from "../controllers/analytics.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const analyticsRoutes = Router();

analyticsRoutes.get(
  "/dashboard",
  passportAuthenticateJwt,
  getDashboardAnalyticsController
);

export default analyticsRoutes;
