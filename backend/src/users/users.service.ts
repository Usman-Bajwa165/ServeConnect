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

  async getProviders(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: "SERVICE_PROVIDER", isBanned: false },
        select: {
          ...userSelect,
          providerServices: {
            where: { isDeleted: false },
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
      this.prisma.user.count({
        where: { role: "SERVICE_PROVIDER", isBanned: false },
      }),
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
}
