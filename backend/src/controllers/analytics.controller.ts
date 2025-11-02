import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middeware";
import { HTTPSTATUS } from "../config/http.config";
import { getDashboardAnalyticsService } from "../services/analytics.service";

export const getDashboardAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const analytics = await getDashboardAnalyticsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Analytics fetched successfully",
      data: analytics,
    });
  }
);
