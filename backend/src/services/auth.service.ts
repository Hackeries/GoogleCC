import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../config/database.config";
import { LoginDto, RegisterDto } from "../database/dto/auth.dto";
import { User } from "../database/entities/user.entity";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { Availability } from "../database/entities/availability.entity";
import {
  DayAvailability,
  DayOfWeekEnum,
} from "../database/entities/day-availability";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (registerDto: RegisterDto) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);
  const dayAvailabilityRepository =
    AppDataSource.getRepository(DayAvailability);

  const existingUser = await userRepository.findOne({
    where: { email: registerDto.email },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const username = await generateUsername(registerDto.name);
  const user = userRepository.create({
    email: registerDto.email,
    name: registerDto.name,
    password: registerDto.password,
    username,
    imageUrl: registerDto.imageUrl || undefined, // ✅ fixed: no null
  });

  const availability = availabilityRepository.create({
    timeGap: 30,
    days: Object.values(DayOfWeekEnum).map((day) =>
      dayAvailabilityRepository.create({
        day,
        startTime: new Date(`2025-03-01T09:00:00Z`),
        endTime: new Date(`2025-03-01T17:00:00Z`),
        isAvailable:
          day !== DayOfWeekEnum.SUNDAY && day !== DayOfWeekEnum.SATURDAY,
      })
    ),
  });

  user.availability = availability;
  await userRepository.save(user);

  return { user: user.omitPassword() };
};

export const loginService = async (loginDto: LoginDto) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { email: loginDto.email },
  });

  if (!user) throw new NotFoundException("User not found");

  const isPasswordValid = await user.comparePassword(loginDto.password);
  if (!isPasswordValid)
    throw new UnauthorizedException("Invalid email or password");

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
  };
};

async function generateUsername(name: string): Promise<string> {
  const cleanName = name.replace(/\s+/g, "").toLowerCase();
  const uuidSuffix = uuidv4().slice(0, 4);
  const baseUsername = `${cleanName}${uuidSuffix}`;
  const userRepository = AppDataSource.getRepository(User);

  let username = baseUsername;
  while (
    await userRepository.findOne({
      where: { username },
    })
  ) {
    username = `${cleanName}${uuidv4().slice(0, 4)}`;
  }

  return username;
}
