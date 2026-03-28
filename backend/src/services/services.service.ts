import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, city?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = { isDeleted: false };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (city) {
      where.location = city;
    }

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              fullName: true,
              city: true,
              reviewsReceived: { select: { rating: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.service.count({ where }),
    ]);

    const services = data.map((s) => ({
      ...s,
      provider: {
        ...s.provider,
        averageRating:
          s.provider.reviewsReceived.length > 0
            ? s.provider.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
              s.provider.reviewsReceived.length
            : 0,
        reviewsReceived: undefined,
      },
    }));

    return { data: services, total, page, limit };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, isDeleted: false },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            city: true,
            reviewsReceived: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                author: { select: { id: true, fullName: true } },
              },
            },
          },
        },
      },
    });
    if (!service) throw new NotFoundException("Service not found");
    return service;
  }

  async create(providerId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        price: dto.price,
        providerId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findFirst({
      where: { id, isDeleted: false },
    });
    if (!service) throw new NotFoundException("Service not found");
    if (service.providerId !== userId)
      throw new ForbiddenException("You can only edit your own services");

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, isDeleted: false },
    });
    if (!service) throw new NotFoundException("Service not found");
    if (service.providerId !== userId && userRole !== "ADMIN")
      throw new ForbiddenException("Access denied");

    return this.prisma.service.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getMyServices(providerId: string) {
    return this.prisma.service.findMany({
      where: { providerId, isDeleted: false },
      include: {
        _count: {
          select: { applications: { where: { status: "PENDING" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
