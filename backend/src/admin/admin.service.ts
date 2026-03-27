import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          city: true,
          isBanned: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);
    return { data, total, page, limit };
  }

  async banUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.update({ where: { id }, data: { isBanned: true } });
    // The JwtStrategy checks isBanned on every request, so blacklisting is implicit
    return { message: `User ${user.email} has been banned` };
  }

  async unbanUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.update({ where: { id }, data: { isBanned: false } });
    return { message: `User ${user.email} has been unbanned` };
  }

  async getAllServices(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where: { isDeleted: false },
        include: {
          provider: { select: { id: true, fullName: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.service.count({ where: { isDeleted: false } }),
    ]);
    return { data, total, page, limit };
  }

  async deleteService(id: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, isDeleted: false },
    });
    if (!service) throw new NotFoundException("Service not found");
    await this.prisma.service.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: "Service deleted" };
  }

  async getAllAvailRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.availRequest.findMany({
        where: { isDeleted: false },
        include: {
          availer: { select: { id: true, fullName: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.availRequest.count({ where: { isDeleted: false } }),
    ]);
    return { data, total, page, limit };
  }

  async deleteAvailRequest(id: string) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id, isDeleted: false },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    await this.prisma.availRequest.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: "Avail request deleted" };
  }
}
