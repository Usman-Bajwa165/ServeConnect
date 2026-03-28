import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const userSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  city: true,
  isBanned: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getProviders(search?: string, city?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: any = { role: "SERVICE_PROVIDER", isBanned: false };

    // FIX: Filter by providers who have at least one service in the target city
    if (city) {
      where.providerServices = {
        some: {
          location: { contains: city, mode: "insensitive" },
          isDeleted: false,
        },
      };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        {
          providerServices: {
            some: {
              isDeleted: false,
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          ...userSelect,
          providerServices: {
            where: {
              isDeleted: false,
              ...(city
                ? { location: { contains: city, mode: "insensitive" } }
                : {}),
            },
            select: { id: true, title: true, price: true, location: true },
          },
          reviewsReceived: {
            select: { rating: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    const providers = data.map((p) => ({
      ...p,
      averageRating:
        p.reviewsReceived.length > 0
          ? p.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
            p.reviewsReceived.length
          : 0,
      reviewCount: p.reviewsReceived.length,
      serviceCount: p.providerServices.length,
    }));

    return { data: providers, total, page, limit };
  }

  async getAvailaers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: "SERVICE_AVAILER", isBanned: false },
        select: {
          ...userSelect,
          availerPostings: {
            where: { isDeleted: false, isReserved: false },
            select: { id: true, title: true, price: true, location: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({
        where: { role: "SERVICE_AVAILER", isBanned: false },
      }),
    ]);

    return { data, total, page, limit };
  }

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelect,
        providerServices: {
          where: { isDeleted: false },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            location: true,
            createdAt: true,
            applications: { select: { applicantId: true } },
          },
        },
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!user) throw new NotFoundException("User not found");

    const avgRating =
      user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
          user.reviewsReceived.length
        : 0;

    return { ...user, averageRating: avgRating };
  }

  async getUserReviews(id: string) {
    return this.prisma.review.findMany({
      where: { targetId: id },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        author: { select: { id: true, fullName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getMyFullProfile(userId: string, role: string) {
    if (role === "SERVICE_PROVIDER") {
      const services = await this.prisma.service.findMany({
        where: { providerId: userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
      });
      const reviews = await this.prisma.review.findMany({
        where: { targetId: userId },
        include: { author: { select: { id: true, fullName: true, city: true } } },
        orderBy: { createdAt: "desc" },
      });
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
      return { services, reviews, averageRating: avgRating };
    }

    if (role === "SERVICE_AVAILER") {
      const completedRequests = await this.prisma.availRequest.findMany({
        where: { availerId: userId, isDeleted: false, isCompleted: true },
        orderBy: { createdAt: "desc" },
      });
      const reviewsGiven = await this.prisma.review.findMany({
        where: { authorId: userId },
        include: { target: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: "desc" },
      });
      return { completedRequests, reviewsGiven };
    }

    return {};
  }

  async getStats(userId: string, role: string) {
    if (role === "ADMIN") {
      const [totalUsers, totalServices, totalRequests] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.service.count({ where: { isDeleted: false } }),
        this.prisma.availRequest.count({ where: { isDeleted: false } }),
      ]);
      return { totalUsers, totalServices, totalRequests, pendingModeration: 3 };
    }

    if (role === "SERVICE_AVAILER") {
      const [activeRequests, pendingApps, completedTasks] = await Promise.all([
        this.prisma.availRequest.count({
          where: { availerId: userId, isDeleted: false, isReserved: false },
        }),
        this.prisma.application.count({
          where: { availRequest: { availerId: userId }, status: "PENDING" },
        }),
        this.prisma.availRequest.count({
          where: { availerId: userId, isCompleted: true },
        }),
      ]);
      return { activeRequests, pendingApps, completedTasks };
    }

    if (role === "SERVICE_PROVIDER") {
      const [availableJobs, appsSent, myServicesCount] = await Promise.all([
        this.prisma.availRequest.count({
          where: { isDeleted: false, isReserved: false },
        }),
        this.prisma.application.count({
          where: { applicantId: userId },
        }),
        this.prisma.service.count({
          where: { providerId: userId, isDeleted: false },
        }),
      ]);
      return { availableJobs, appsSent, myServices: myServicesCount };
    }

    return {};
  }
}
