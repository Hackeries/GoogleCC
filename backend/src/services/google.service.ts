import { OAuth2Client } from "google-auth-library";
import { AppDataSource } from "../config/database.config";
import { User } from "../database/entities/user.entity";
import { signJwtToken } from "../utils/jwt";
import { BadRequestException } from "../utils/app-error";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (token: string) => {
  if (!token) throw new BadRequestException("Missing Google token");

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new BadRequestException("Invalid Google token");

  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOne({
    where: { email: payload.email },
  });

  if (!user) {
    user = userRepository.create({
      name: payload.name || "Unnamed",
      email: payload.email,
      imageUrl: payload.picture || undefined,
      username: payload.email.split("@")[0],
    });
    await userRepository.save(user);
  }

  const { token: jwtToken, expiresAt } = signJwtToken({ userId: user.id });

  return {
    user: user.omitPassword(),
    accessToken: jwtToken,
    expiresAt,
  };
};
