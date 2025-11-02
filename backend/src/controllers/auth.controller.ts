import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { LoginDto, RegisterDto } from "../database/dto/auth.dto";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import { loginService, registerService } from "../services/auth.service";
import { googleLoginService } from "../services/google.service"; // ✅ Fixed import

export const registerController = asyncHandlerAndValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDTO) => {
    const { user } = await registerService(registerDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user,
    });
  }
);

export const loginController = asyncHandlerAndValidation(
  LoginDto,
  "body",
  async (req: Request, res: Response, loginDto) => {
    const { user, accessToken, expiresAt } = await loginService(loginDto);
    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
    });
  }
);

// ✅ Google login handler
export const googleLoginController = async (req: Request, res: Response) => {
  const { token } = req.body;
  const { user, accessToken, expiresAt } = await googleLoginService(token);

  return res.status(HTTPSTATUS.OK).json({
    message: "Google login successful",
    user,
    accessToken,
    expiresAt,
  });
};
