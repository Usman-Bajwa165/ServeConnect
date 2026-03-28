import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { ApplyDto } from "./dto/apply.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // FLOW A: Provider applies to availer's request
  @Post("avail-requests/:id/apply")
  @Roles(Role.SERVICE_PROVIDER)
  applyToAvailRequest(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() dto: ApplyDto,
  ) {
    return this.applicationsService.applyToAvailRequest(id, user.id, dto);
  }

  @Get("avail-requests/:id/applications")
  @Roles(Role.SERVICE_AVAILER)
  getAvailRequestApplications(
    @Param("id") id: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.getAvailRequestApplications(id, user.id);
  }

  @Post("avail-requests/:id/applications/:appId/accept")
  @Roles(Role.SERVICE_AVAILER)
  acceptAvailRequestApplication(
    @Param("id") id: string,
    @Param("appId") appId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.acceptAvailRequestApplication(
      id,
      appId,
      user.id,
    );
  }

  @Post("avail-requests/:id/applications/:appId/reject")
  @Roles(Role.SERVICE_AVAILER)
  rejectAvailRequestApplication(
    @Param("id") id: string,
    @Param("appId") appId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.rejectAvailRequestApplication(
      id,
      appId,
      user.id,
    );
  }

  // FLOW B: Availer applies to provider's service
  @Post("services/:id/apply")
  @Roles(Role.SERVICE_AVAILER)
  applyToService(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() dto: ApplyDto,
  ) {
    return this.applicationsService.applyToService(id, user.id, dto);
  }

  @Get("services/:id/applications")
  @Roles(Role.SERVICE_PROVIDER)
  getServiceApplications(@Param("id") id: string, @CurrentUser() user: any) {
    return this.applicationsService.getServiceApplications(id, user.id);
  }

  @Post("services/:id/applications/:appId/accept")
  @Roles(Role.SERVICE_PROVIDER)
  acceptServiceApplication(
    @Param("id") id: string,
    @Param("appId") appId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.acceptServiceApplication(
      id,
      appId,
      user.id,
    );
  }

  @Post("services/:id/applications/:appId/reject")
  @Roles(Role.SERVICE_PROVIDER)
  rejectServiceApplication(
    @Param("id") id: string,
    @Param("appId") appId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.rejectServiceApplication(
      id,
      appId,
      user.id,
    );
  }

  // Provider's accepted/pending jobs
  @Get("applications/pending-jobs")
  @Roles(Role.SERVICE_PROVIDER)
  getPendingJobs(@CurrentUser() user: any) {
    return this.applicationsService.getProviderPendingJobs(user.id);
  }

  @Patch("applications/:id/complete")
  @Roles(Role.SERVICE_AVAILER)
  completeApplication(@Param("id") id: string, @CurrentUser() user: any) {
    return this.applicationsService.completeApplication(id, user.id);
  }

  // Generic endpoint for user to get all their own PENDING applications
  @Get("applications/applied")
  @Roles(Role.SERVICE_PROVIDER, Role.SERVICE_AVAILER)
  getMyAppliedJobs(@CurrentUser() user: any) {
    return this.applicationsService.getMyAppliedJobs(user.id);
  }

  // Availer's accepted/availed list
  @Get("applications/availed")
  @Roles(Role.SERVICE_AVAILER)
  getAvailed(@CurrentUser() user: any) {
    return this.applicationsService.getAvailedApplications(user.id);
  }
}
