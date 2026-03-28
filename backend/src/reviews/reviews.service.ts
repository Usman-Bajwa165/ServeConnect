import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId: string, dto: CreateReviewDto) {
    // Load the application with all relations
    const app = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        service: { include: { provider: true } },
        availRequest: { include: { availer: true } },
        applicant: true,
      },
    });

    if (!app) throw new NotFoundException("Application not found");
    if (!app.isCompleted)
      throw new ForbiddenException("Job must be completed before reviewing");
    if (app.status !== "ACCEPTED")
      throw new ForbiddenException("Can only review on accepted applications");

    // Determine the two parties: provider and availer
    const isServiceJob = !!app.serviceId;
    const providerId = isServiceJob
      ? app.service.provider.id
      : app.applicantId;
    const availerId = isServiceJob
      ? app.applicantId
      : app.availRequest.availerId;

    // Author must be one of the two parties
    if (authorId !== providerId && authorId !== availerId) {
      throw new ForbiddenException("You were not part of this job");
    }

    // Target must be the other party
    const expectedTargetId =
      authorId === providerId ? availerId : providerId;
    if (dto.targetId !== expectedTargetId) {
      throw new BadRequestException("Invalid review target for this job");
    }

    // One review per author per application
    const existing = await this.prisma.review.findUnique({
      where: { authorId_applicationId: { authorId, applicationId: dto.applicationId } },
    });
    if (existing) throw new ConflictException("You have already reviewed this job");

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        authorId,
        targetId: dto.targetId,
        applicationId: dto.applicationId,
      },
      include: {
        author: { select: { id: true, fullName: true } },
        target: { select: { id: true, fullName: true } },
      },
    });
  }

  async getProviderReviews(providerId: string) {
    return this.prisma.review.findMany({
      where: { targetId: providerId },
      include: {
        author: { select: { id: true, fullName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
