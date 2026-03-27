import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("users")
  getAllUsers(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Post("users/:id/ban")
  banUser(@Param("id") id: string) {
    return this.adminService.banUser(id);
  }

  @Post("users/:id/unban")
  unbanUser(@Param("id") id: string) {
    return this.adminService.unbanUser(id);
  }

  @Get("services")
  getAllServices(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllServices(page, limit);
  }

  @Delete("services/:id")
  deleteService(@Param("id") id: string) {
    return this.adminService.deleteService(id);
  }

  @Get("avail-requests")
  getAllAvailRequests(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllAvailRequests(page, limit);
  }

  @Delete("avail-requests/:id")
  deleteAvailRequest(@Param("id") id: string) {
    return this.adminService.deleteAvailRequest(id);
  }
}
