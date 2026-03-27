import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.id);
  }

  @Roles(Role.SERVICE_AVAILER, Role.ADMIN)
  @Get("providers")
  getProviders(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getProviders(page, limit);
  }

  @Roles(Role.SERVICE_PROVIDER, Role.ADMIN)
  @Get("availers")
  getAvailaers(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getAvailaers(page, limit);
  }

  @Get(":id/reviews")
  getUserReviews(@Param("id") id: string) {
    return this.usersService.getUserReviews(id);
  }

  @Get(":id")
  getUserProfile(@Param("id") id: string) {
    return this.usersService.getUserProfile(id);
  }
}
