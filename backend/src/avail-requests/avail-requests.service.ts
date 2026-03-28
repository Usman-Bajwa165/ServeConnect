import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateAvailRequestDto,
  UpdateAvailRequestDto,
} from "./dto/avail-request.dto";

@Injectable()
export class AvailRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, city?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = { isDeleted: false, isReserved: false };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (city) {
      where.location = { contains: city, mode: "insensitive" };
    }

    const [data, total] = await Promise.all([
      this.prisma.availRequest.findMany({
        where,
        include: {
          availer: {
            select: { id: true, fullName: true, city: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.availRequest.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id, isDeleted: false },
      include: {
        availer: { select: { id: true, fullName: true, city: true } },
      },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    return req;
  }

  async create(availerId: string, dto: CreateAvailRequestDto) {
    return this.prisma.availRequest.create({
      data: { ...dto, price: dto.price, availerId },
    });
  }

  async update(id: string, userId: string, dto: UpdateAvailRequestDto) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id, isDeleted: false },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.availerId !== userId)
      throw new ForbiddenException("You can only edit your own requests");

    return this.prisma.availRequest.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string, userRole: string) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id, isDeleted: false },
    });
    if (!req) throw new NotFoundException("Avail request not found");
    if (req.availerId !== userId && userRole !== "ADMIN")
      throw new ForbiddenException("Access denied");

    return this.prisma.availRequest.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getMyRequests(availerId: string) {
    return this.prisma.availRequest.findMany({
      where: { availerId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async markComplete(id: string, userId: string) {
    const req = await this.prisma.availRequest.findFirst({
      where: { id, isDeleted: false, isReserved: true },
      include: {
        applications: {
          where: { status: "ACCEPTED" },
          select: { applicantId: true },
        },
      },
    });
    if (!req)
      throw new NotFoundException("Avail request not found or not reserved");

    const acceptedApplicantId = req.applications[0]?.applicantId;
    if (req.availerId !== userId && acceptedApplicantId !== userId)
      throw new ForbiddenException(
        "Only the accepted provider or availer owner can mark complete",
      );

    return this.prisma.availRequest.update({
      where: { id },
      data: { isCompleted: true },
    });
  }
}
