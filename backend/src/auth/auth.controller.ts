import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
} from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { SignupDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Request() req: any, @Headers("authorization") authHeader: string) {
    const token = authHeader?.replace("Bearer ", "");
    return this.authService.logout(req.user, token);
  }
}
