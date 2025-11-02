import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middeware";
import { initializeDatabase } from "./database/database";

// 🧩 Import route files
import authRoutes from "./routes/auth.route";
import eventRoutes from "./routes/event.route";
import availabilityRoutes from "./routes/availability.route";
import integrationRoutes from "./routes/integration.route";
import meetingRoutes from "./routes/meeting.route";

const app = express();

// -------------------------
// ⚙️ Base Configurations
// -------------------------
const BASE_PATH = config.BASE_PATH || "/api";
const PORT = config.PORT || 8000;

// -------------------------
// 🧩 Middleware Setup
// -------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// -------------------------
// 🧠 Health Check Route
// -------------------------
app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "🚀 Google Calendar Clone Backend is running successfully!",
    });
  })
);

// -------------------------
// 🚀 API Routes
// -------------------------
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/events`, eventRoutes);
app.use(`${BASE_PATH}/availability`, availabilityRoutes);
app.use(`${BASE_PATH}/integration`, integrationRoutes);
app.use(`${BASE_PATH}/meeting`, meetingRoutes);

// -------------------------
// ⚠️ 404 Handler
// -------------------------
app.use((req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// -------------------------
// ⚠️ Global Error Handling
// -------------------------
app.use(errorHandler);

// -------------------------
// 🗄️ Database & Server Start
// -------------------------
(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}${BASE_PATH}`);
      console.log(`🗄️ Database initialized successfully`);
      console.log(`🌎 Environment: ${config.NODE_ENV}`);
    });
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();
