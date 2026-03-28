import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { ServicesService } from "./services.service";
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("city") city?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.servicesService.findAll(search, city, page, limit);
  }

  @Get("my")
  @Roles(Role.SERVICE_PROVIDER)
  getMyServices(@CurrentUser() user: any) {
    return this.servicesService.getMyServices(user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Roles(Role.SERVICE_PROVIDER)
  create(@CurrentUser() user: any, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(user.id, dto);
  }

  @Patch(":id")
  @Roles(Role.SERVICE_PROVIDER)
  update(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, user.id, dto);
  }

  @Delete(":id")
  @Roles(Role.SERVICE_PROVIDER, Role.ADMIN)
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.servicesService.remove(id, user.id, user.role);
  }
}
