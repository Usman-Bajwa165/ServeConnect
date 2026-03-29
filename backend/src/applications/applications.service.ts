import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ApplyDto } from "./dto/apply.dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  // Provider applies to an Availer's AvailRequest
  async applyToAvailRequest(
    availRequestId: string,
    applicantId: string,
    dto: ApplyDto,
  ) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id: availRequestId, isDeleted: false },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.isReserved)
      throw new BadRequestException("This request has already been reserved");

    const existing = await this.prisma.application.findFirst({
      where: { availRequestId, applicantId },
    });
    if (existing)
      throw new ConflictException("You have already applied to this request");

    const app = await this.prisma.application.create({
      data: {
        note: dto.note,
        contactNumber: dto.contactNumber,
        applicantId,
        availRequestId,
      },
      include: { applicant: true },
    });

    await this.notificationsService.create({
      userId: req.availerId,
      title: "New Application",
      message: `${app.applicant.fullName} applied to your request "${req.title}".`,
    });

    return app;
  }

  // Availer applies to a Provider's Service
  async applyToService(serviceId: string, applicantId: string, dto: ApplyDto) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, isDeleted: false },
    });
    if (!service) throw new NotFoundException("Service not found");

    const existing = await this.prisma.application.findFirst({
      where: { serviceId, applicantId, status: "PENDING" },
    });
    if (existing)
      throw new ConflictException("You already have a pending application for this service");

    const app = await this.prisma.application.create({
      data: {
        note: dto.note,
        contactNumber: dto.contactNumber,
        applicantId,
        serviceId,
      },
      include: { applicant: true },
    });

    await this.notificationsService.create({
      userId: service.providerId,
      title: "New Application",
      message: `${app.applicant.fullName} applied to your service "${service.title}".`,
    });

    return app;
  }

  // Get applications for an AvailRequest (availer owner only)
  async getAvailRequestApplications(availRequestId: string, userId: string) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id: availRequestId },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.availerId !== userId) throw new ForbiddenException("Access denied");

    return this.prisma.application.findMany({
      where: { availRequestId },
      include: {
        applicant: {
          select: {
            id: true,
            fullName: true,
            city: true,
            reviewsReceived: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get applications for a Service (provider owner only)
  async getServiceApplications(serviceId: string, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId },
    });
    if (!service) throw new NotFoundException("Service not found");
    if (service.providerId !== userId)
      throw new ForbiddenException("Access denied");

    return this.prisma.application.findMany({
      where: { serviceId },
      include: {
        applicant: { select: { id: true, fullName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Accept application to AvailRequest (availer owner)
  async acceptAvailRequestApplication(
    availRequestId: string,
    appId: string,
    userId: string,
  ) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id: availRequestId },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.availerId !== userId) throw new ForbiddenException("Access denied");

    const app = await this.prisma.application.findFirst({
      where: { id: appId, availRequestId },
    });
    if (!app) throw new NotFoundException("Application not found");

    // Accept this application
    await this.prisma.application.update({
      where: { id: appId },
      data: { status: "ACCEPTED" },
    });

    // Reject all other pending apps for same request
    await this.prisma.application.updateMany({
      where: { availRequestId, id: { not: appId }, status: "PENDING" },
      data: { status: "REJECTED" },
    });

    // Mark request as reserved
    await this.prisma.availRequest.update({
      where: { id: availRequestId },
      data: { isReserved: true },
    });

    await this.notificationsService.create({
      userId: app.applicantId,
      title: "Application Accepted!",
      message: `Your application to "${req.title}" was accepted.`,
    });

    return { message: "Application accepted and request reserved" };
  }

  // Reject application to AvailRequest (availer owner)
  async rejectAvailRequestApplication(
    availRequestId: string,
    appId: string,
    userId: string,
  ) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id: availRequestId },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.availerId !== userId) throw new ForbiddenException("Access denied");

    const updated = await this.prisma.application.update({
      where: { id: appId },
      data: { status: "REJECTED" },
    });

    await this.notificationsService.create({
      userId: updated.applicantId,
      title: "Application Rejected",
      message: `Your application to "${req.title}" was declined.`,
    });

    return updated;
  }

  // Accept application to Service (provider owner) — does NOT hide service
  async acceptServiceApplication(
    serviceId: string,
    appId: string,
    userId: string,
  ) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId },
    });
    if (!service) throw new NotFoundException("Service not found");
    if (service.providerId !== userId)
      throw new ForbiddenException("Access denied");

    const app = await this.prisma.application.update({
      where: { id: appId },
      data: { status: "ACCEPTED" },
    });

    await this.notificationsService.create({
      userId: app.applicantId,
      title: "Application Accepted",
      message: `Your application to "${service.title}" was accepted!`,
    });

    return app;
  }

  // Reject application to Service (provider owner)
  async rejectServiceApplication(
    serviceId: string,
    appId: string,
    userId: string,
  ) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId },
    });
    if (!service) throw new NotFoundException("Service not found");
    if (service.providerId !== userId)
      throw new ForbiddenException("Access denied");

    const app = await this.prisma.application.update({
      where: { id: appId },
      data: { status: "REJECTED" },
    });

    await this.notificationsService.create({
      userId: app.applicantId,
      title: "Application Rejected",
      message: `Your application to "${service.title}" was declined.`,
    });

    return app;
  }

  // Get pending jobs for a provider (accepted applications)
  async getProviderPendingJobs(providerId: string) {
    const jobs = await this.prisma.application.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          {
            applicantId: providerId,
            availRequestId: { not: null },
          },
          {
            service: { providerId: providerId },
            serviceId: { not: null },
          },
        ],
      },
      include: {
        availRequest: {
          include: {
            availer: { select: { id: true, fullName: true, city: true } },
          },
        },
        service: true,
        applicant: {
          select: { id: true, fullName: true, city: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      jobs.map(async (job) => {
        if (!job.isCompleted) return { ...job, reviewGiven: false };
        const review = await this.prisma.review.findUnique({
          where: {
            authorId_applicationId: {
              authorId: providerId,
              applicationId: job.id,
            },
          },
        });
        return { ...job, reviewGiven: !!review };
      }),
    );
  }

  // Get availed (accepted) applications for an availer
  async getAvailedApplications(availerId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        OR: [
          {
            applicantId: availerId,
            status: "ACCEPTED",
            serviceId: { not: null },
          },
          {
            availRequest: { availerId: availerId },
            status: "ACCEPTED",
          },
        ],
      },
      include: {
        service: {
          include: {
            provider: { select: { id: true, fullName: true, city: true } },
          },
        },
        availRequest: {
          include: {
            availer: { select: { id: true, fullName: true, city: true } },
          },
        },
        applicant: {
          select: { id: true, fullName: true, city: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      applications.map(async (app) => {
        if (!app.isCompleted) return { ...app, reviewGiven: false };
        const review = await this.prisma.review.findUnique({
          where: {
            authorId_applicationId: {
              authorId: availerId,
              applicationId: app.id,
            },
          },
        });
        return { ...app, reviewGiven: !!review };
      }),
    );
  }

  // Unified completion for any accepted application (availer marks it done)
  async completeApplication(appId: string, userId: string) {
    const app = await this.prisma.application.findFirst({
      where: { id: appId },
      include: { availRequest: true, service: true },
    });
    if (!app) throw new NotFoundException("Application not found");

    // The availer is either the applicant (for Services) or the request owner (for Requests)
    const availerId = app.serviceId
      ? app.applicantId
      : app.availRequest?.availerId;
    if (availerId !== userId) throw new ForbiddenException("Access denied");

    // Mark application itself as completed
    await this.prisma.application.update({
      where: { id: appId },
      data: { isCompleted: true },
    });

    // If it's a request-based application, also mark the posting as completed
    if (app.availRequestId) {
      await this.prisma.availRequest.update({
        where: { id: app.availRequestId },
        data: { isCompleted: true },
      });
    }

    // Notify the Provider (the other party)
    const providerId = app.serviceId ? app.service.providerId : app.applicantId;

    await this.notificationsService.create({
      userId: providerId,
      title: "Task Completed",
      message: `The client has marked the task "${app.serviceId ? app.service.title : app.availRequest.title}" as completed. You can ahora see it in your completed history.`,
    });

    return { message: "Task marked as completed" };
  }

  // Pending applicant counts for nav dot indicators
  async getPendingCounts(userId: string, role: string) {
    if (role === "SERVICE_PROVIDER") {
      const count = await this.prisma.application.count({
        where: { service: { providerId: userId }, status: "PENDING" },
      });
      return { myItemsPending: count };
    }
    if (role === "SERVICE_AVAILER") {
      const count = await this.prisma.application.count({
        where: { availRequest: { availerId: userId }, status: "PENDING" },
      });
      return { myItemsPending: count };
    }
    return { myItemsPending: 0 };
  }

  // Get all avail-request applications by this provider (any status) — used to hide applied requests in browse
  async getMyAvailRequestApplications(providerId: string) {
    return this.prisma.application.findMany({
      where: { applicantId: providerId, availRequestId: { not: null } },
      select: { availRequestId: true },
    });
  }

  // Get all service applications by this availer (any status) — used to hide applied services in browse
  async getMyServiceApplications(availerId: string) {
    return this.prisma.application.findMany({
      where: { applicantId: availerId, serviceId: { not: null } },
      select: { serviceId: true, status: true },
    });
  }

  // Get purely pending applications submitted by a user
  async getMyAppliedJobs(userId: string) {
    return this.prisma.application.findMany({
      where: {
        applicantId: userId,
        status: "PENDING",
      },
      include: {
        availRequest: {
          include: {
            availer: { select: { id: true, fullName: true, city: true } },
          },
        },
        service: {
          include: {
            provider: { select: { id: true, fullName: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
