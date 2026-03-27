import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { AvailRequestsService } from "./avail-requests.service";
import {
  CreateAvailRequestDto,
  UpdateAvailRequestDto,
} from "./dto/avail-request.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("avail-requests")
export class AvailRequestsController {
  constructor(private readonly availRequestsService: AvailRequestsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("city") city?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.availRequestsService.findAll(search, city, page, limit);
  }

  @Get("my")
  @Roles(Role.SERVICE_AVAILER)
  getMyRequests(@CurrentUser() user: any) {
    return this.availRequestsService.getMyRequests(user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.availRequestsService.findOne(id);
  }

  @Post()
  @Roles(Role.SERVICE_AVAILER)
  create(@CurrentUser() user: any, @Body() dto: CreateAvailRequestDto) {
    return this.availRequestsService.create(user.id, dto);
  }

  @Put(":id")
  @Roles(Role.SERVICE_AVAILER)
  update(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateAvailRequestDto,
  ) {
    return this.availRequestsService.update(id, user.id, dto);
  }

  @Delete(":id")
  @Roles(Role.SERVICE_AVAILER, Role.ADMIN)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.availRequestsService.remove(id, user.id, user.role);
  }

  @Post(":id/complete")
  markComplete(@Param("id") id: string, @CurrentUser() user: any) {
    return this.availRequestsService.markComplete(id, user.id);
  }
}
