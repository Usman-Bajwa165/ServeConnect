import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ApplyDto } from "./dto/apply.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.application.create({
      data: {
        note: dto.note,
        contactNumber: dto.contactNumber,
        applicantId,
        availRequestId,
      },
    });
  }

  // Availer applies to a Provider's Service
  async applyToService(serviceId: string, applicantId: string, dto: ApplyDto) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, isDeleted: false },
    });
    if (!service) throw new NotFoundException("Service not found");

    const existing = await this.prisma.application.findFirst({
      where: { serviceId, applicantId },
    });
    if (existing)
      throw new ConflictException("You have already applied to this service");

    return this.prisma.application.create({
      data: {
        note: dto.note,
        contactNumber: dto.contactNumber,
        applicantId,
        serviceId,
      },
    });
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

    return this.prisma.application.update({
      where: { id: appId },
      data: { status: "REJECTED" },
    });
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

    return this.prisma.application.update({
      where: { id: appId },
      data: { status: "ACCEPTED" },
    });
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

    return this.prisma.application.update({
      where: { id: appId },
      data: { status: "REJECTED" },
    });
  }

  // Get pending jobs for a provider (accepted applications)
  async getProviderPendingJobs(providerId: string) {
    return this.prisma.application.findMany({
      where: {
        applicantId: providerId,
        status: "ACCEPTED",
        availRequest: { isCompleted: false },
      },
      include: {
        availRequest: {
          include: {
            availer: { select: { id: true, fullName: true, city: true } },
          },
        },
        service: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get availed (accepted) applications for an availer
  async getAvailedApplications(availerId: string) {
    return this.prisma.application.findMany({
      where: {
        applicant: { id: availerId },
        status: "ACCEPTED",
        serviceId: { not: null },
      },
      include: {
        service: {
          include: {
            provider: { select: { id: true, fullName: true, city: true } },
          },
        },
        availRequest: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
