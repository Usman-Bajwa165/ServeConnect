import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId: string, dto: CreateReviewDto) {
    // Check author is an availer (already guarded, but double-check target is a provider)
    const target = await this.prisma.user.findUnique({
      where: { id: dto.targetId },
    });
    if (!target || target.role !== "SERVICE_PROVIDER") {
      throw new BadRequestException("You can only review Service Providers");
    }

    // Check they had an accepted application together
    const acceptedApp = await this.prisma.application.findFirst({
      where: {
        applicantId: authorId,
        status: "ACCEPTED",
        service: { providerId: dto.targetId },
      },
    });

    if (!acceptedApp) {
      throw new ForbiddenException(
        "You can only review providers you have had an accepted application with",
      );
    }

    // Check unique constraint (will throw P2002 if already reviewed)
    const existingReview = await this.prisma.review.findUnique({
      where: { authorId_targetId: { authorId, targetId: dto.targetId } },
    });
    if (existingReview) {
      throw new ConflictException("You have already reviewed this provider");
    }

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        authorId,
        targetId: dto.targetId,
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
