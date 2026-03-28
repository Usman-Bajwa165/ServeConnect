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

  @Get("me/full-profile")
  getMyFullProfile(@CurrentUser() user: any) {
    return this.usersService.getMyFullProfile(user.id, user.role);
  }

  @Get("me/stats")
  getStats(@CurrentUser() user: any) {
    return this.usersService.getStats(user.id, user.role);
  }

  @Roles(Role.SERVICE_AVAILER, Role.ADMIN)
  @Get("providers")
  getProviders(
    @Query("search") search: string,
    @Query("city") city: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getProviders(search, city, page, limit);
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
