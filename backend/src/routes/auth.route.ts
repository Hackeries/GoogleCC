import { Router } from "express";
import {
  loginController,
  registerController,
  googleLoginController,
} from "../controllers/auth.controller";

const authRoutes = Router();

// ✅ Properly typed async handlers – cast to RequestHandler for Express
authRoutes.post("/register", registerController as any);
authRoutes.post("/login", loginController as any);
authRoutes.post("/google", googleLoginController as any);

export default authRoutes;
