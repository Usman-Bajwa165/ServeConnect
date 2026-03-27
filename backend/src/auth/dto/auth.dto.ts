import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsIn,
} from "class-validator";
import { Role } from "@prisma/client";
import { PAKISTAN_CITIES } from "../../common/constants/cities.constant";

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsEnum([Role.SERVICE_PROVIDER, Role.SERVICE_AVAILER])
  role: Role;

  @IsOptional()
  @IsIn(PAKISTAN_CITIES)
  city?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
